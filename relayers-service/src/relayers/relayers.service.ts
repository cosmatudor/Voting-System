// src/relayers/relayers.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RelayerEntity } from './entities/relayer.entity/relayer.entity';
import { UserEntity } from '../users/entities/user.entity/user.entity';
import { Account, Address, DevnetEntrypoint, IPlainTransactionObject, KeyPair, Transaction, UserSecretKey } from '@multiversx/sdk-core';

import * as crypto from 'crypto';
import { ContractLoader } from '@multiversx/sdk-nestjs-common';

@Injectable()
export class RelayersService {
  constructor(
    @InjectRepository(RelayerEntity)
    private relayersRepository: Repository<RelayerEntity>,
    ) {}

    async getRelayerForUserAddress(address: string): Promise<RelayerEntity | null> {
        return this.relayersRepository.findOne({ where: { user: { address: address } }, relations: ['user'] });
    }

    async createRelayer(address: string): Promise<RelayerEntity> {
        const keypair = KeyPair.generate();
      
        const privateKey = keypair.secretKey.hex();
        const publicKey = keypair.publicKey.hex();
      
        const secret = process.env.RELAYER_SECRET;
        const encryptedPrivateKey = this.encryptPrivateKey(privateKey, secret);
      
        const relayer = this.relayersRepository.create({
          publicKey,
          encryptedPrivateKey,
          user: { address } as UserEntity,
        });
      
        return this.relayersRepository.save(relayer);
    }

    async composeFundingTransaction(address: string, relayer: RelayerEntity): Promise<IPlainTransactionObject> {
        const entrypoint = new DevnetEntrypoint();
        const userAddress = Address.newFromBech32(address);
        const currentNonce = await entrypoint.recallAccountNonce(userAddress);

        const tx = new Transaction({
            nonce: currentNonce,
            value: 10000000000000000n,
            sender: userAddress,
            receiver: Address.newFromHex(relayer.publicKey),
            gasLimit: 100000n,
            chainID: process.env.CHAIN_ID || 'D',
          });

          console.log("AICI",tx.toPlainObject());

          return tx.toPlainObject();
    }

    async composeRelayerVoteTransaction(
      address: string,
      relayer: RelayerEntity, 
      campaignId: number,
      option: number
    ): Promise<IPlainTransactionObject> {
        const entrypoint = new DevnetEntrypoint();
        const contractAddress = process.env.CONTRACT_ADDRESS;
        const chainID = process.env.CHAIN_ID || 'D';
        const userAddress = Address.newFromBech32(address);
        const currentNonce = await entrypoint.recallAccountNonce(userAddress);

        const functionName = "vote";
        const campaignIdHex = campaignId.toString(16).padStart(1, '0');
        const optionHex = option.toString(16).padStart(1, '0');
        const dataPayload = `${functionName}@${campaignIdHex}@${optionHex}`;

       
        const tx = new Transaction({
            nonce: currentNonce,
            sender: userAddress,
            receiver: Address.newFromBech32(contractAddress),
            data: Buffer.from(dataPayload, 'utf8'),
            relayer: Address.newFromHex(relayer.publicKey),
            gasLimit: 10000000n,
            chainID,
          });

        const privateKeyHex = this.decryptPrivateKey(relayer.encryptedPrivateKey, process.env.RELAYER_SECRET);
        const secretKey = new UserSecretKey(Buffer.from(privateKeyHex, 'hex'));
        const keypair = new KeyPair(secretKey);
        tx.relayerSignature = await Account.newFromKeypair(keypair).signTransaction(tx);

        return tx.toPlainObject();
    }

    private encryptPrivateKey(privateKey: string, secret: string): string {
        const key = crypto.createHash('sha256').update(secret).digest();
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv('aes-256-ctr', key, iv);
        const encrypted = Buffer.concat([cipher.update(privateKey, 'utf8'), cipher.final()]);
        return iv.toString('hex') + ':' + encrypted.toString('hex');
    }

    private decryptPrivateKey(encrypted: string, secret: string): string {
        const [ivHex, encryptedHex] = encrypted.split(':');
        const key = crypto.createHash('sha256').update(secret).digest();
        const iv = Buffer.from(ivHex, 'hex');
        const encryptedText = Buffer.from(encryptedHex, 'hex');
        const decipher = crypto.createDecipheriv('aes-256-ctr', key, iv);
        const decrypted = Buffer.concat([decipher.update(encryptedText), decipher.final()]);
        return decrypted.toString('utf8');
    }
}
