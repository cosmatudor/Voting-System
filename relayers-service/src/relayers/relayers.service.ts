// src/relayers/relayers.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RelayerEntity } from './entities/relayer.entity/relayer.entity';
import { UserEntity } from '../users/entities/user.entity/user.entity';
import { Account, Address, DevnetEntrypoint, IPlainTransactionObject, KeyPair, Transaction, UserSecretKey } from '@multiversx/sdk-core';
import { bech32 } from 'bech32';

import * as crypto from 'crypto';

@Injectable()
export class RelayersService {
  constructor(
    @InjectRepository(RelayerEntity)
    private relayersRepository: Repository<RelayerEntity>,
    ) {}

    async getRelayerForUserAddress(address: string): Promise<RelayerEntity | null> {
        try {
          console.log("OWNER ADDRESS", address)
          const decoded = bech32.decode(address)
          const addressBytes = Buffer.from(bech32.fromWords(decoded.words));
          const shardId = this.computeShardID2(addressBytes, 3);
          
          return await this.relayersRepository.findOne({ where: { user: { address: address }, shardId }, relations: ['user'] });
      } catch (error) {
          throw new Error(`Invalid bech32 address: ${error.message}`);
      }
    }

    async getRelayerForVoter(ownerAddress: string, voterAddress: string): Promise<RelayerEntity | null> {
      try {
        const decoded = bech32.decode(voterAddress)
        const addressBytes = Buffer.from(bech32.fromWords(decoded.words));
        const shardId = this.computeShardID2(addressBytes, 3);
        
        return await this.relayersRepository.findOne({ where: { user: { address: ownerAddress }, shardId }, relations: ['user'] });
    } catch (error) {
        throw new Error(`Invalid bech32 address: ${error.message}`);
    }
  }

    async getAllRelayersForCreator(address: string): Promise<RelayerEntity[]> {
        return await this.relayersRepository.find({ where: { user: { address: address } }, relations: ['user'] });
    }

    
async createRelayer(address: string): Promise<RelayerEntity[]> {
  const relayers: RelayerEntity[] = [];
      for (let shardId = 0; shardId < 3; shardId++) {
          let keypair: KeyPair;
          let currentShardId: number;
          
          do {
              keypair = KeyPair.generate();
              const publicKeyBuffer = Buffer.from(keypair.publicKey.hex(), 'hex');
              currentShardId = this.computeShardID(publicKeyBuffer);
          } while (currentShardId !== shardId);
          
          const privateKey = keypair.secretKey.hex();
          const publicKey = keypair.publicKey.hex();
          const relayerAddress = new Address(publicKey)
          
          const secret = process.env.RELAYER_SECRET;
          const encryptedPrivateKey = this.encryptPrivateKey(privateKey, secret);
          
          const relayer = this.relayersRepository.create({

              publicKey,
              encryptedPrivateKey,
              user: { address } as UserEntity,
              shardId,
          });
          
          const savedRelayer = await this.relayersRepository.save(relayer);
          relayers.push(savedRelayer);
      }
      
      return relayers;
    }

    async composeFundingTransaction(address: string, relayers: RelayerEntity[]): Promise<IPlainTransactionObject[]> {
        const entrypoint = new DevnetEntrypoint();
        const userAddress = Address.newFromBech32(address);
        const currentNonce = await entrypoint.recallAccountNonce(userAddress);
        const chainID = process.env.CHAIN_ID || 'D';

        const txs = relayers.map((relayer, idx) => {
            const tx = new Transaction({
                nonce: currentNonce + BigInt(idx),
                value: 10000000000000000n,
                sender: userAddress,
                receiver: Address.newFromHex(relayer.publicKey),
                gasLimit: 100000n,
                chainID,
            });
            return tx.toPlainObject();
        });

        return txs;
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
        const campaignIdHex = campaignId.toString(16).padStart(16, '0');
        const optionHex = option.toString(16).padStart(2, '0');
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

    private computeShardID(pubKey: Buffer): number {
      const startingIndex = pubKey.length - 1;
      const usedBuffer = pubKey.slice(startingIndex);
      let addr = 0;
      
      for (let i = 0; i < usedBuffer.length; i++) {
          addr = (addr << 8) + usedBuffer[i];
      }
      
      let n = Math.ceil(Math.log2(3));
      let maskHigh = (1 << n) - 1;
      let maskLow = (1 << (n - 1)) - 1;
      let shard = addr & maskHigh;
      
      if (shard > 2) {
          shard = addr & maskLow;
      }
      
      return shard;
  }

  // Traduce calculateMasks din Go
private calculateMasks(numOfShards) {
  const n = Math.ceil(Math.log2(numOfShards));
  return {
      maskHigh: (1 << n) - 1,
      maskLow: (1 << (n - 1)) - 1
  };
}

// Traduce computeIdBasedOfNrOfShardAndMasks din Go
private computeIdBasedOfNrOfShardAndMasks(address, numberOfShards, maskHigh, maskLow) {
  let bytesNeed;
  if (numberOfShards <= 256) {
      bytesNeed = 1;
  } else if (numberOfShards <= 65536) {
      bytesNeed = 2;
  } else if (numberOfShards <= 16777216) {
      bytesNeed = 3;
  } else {
      bytesNeed = 4;
  }
  
  let startingIndex = 0;
  if (address.length > bytesNeed) {
      startingIndex = address.length - bytesNeed;
  }
  
  const buffNeeded = address.slice(startingIndex);
  
  // Verificare pentru smart contract pe metachain (opțional - dacă ai nevoie)
  // if (isSmartContractOnMetachain(buffNeeded, address)) {
  //     return METACHAIN_SHARD_ID; // usually 4294967295
  // }
  
  let addr = 0;
  for (let i = 0; i < buffNeeded.length; i++) {
      addr = (addr << 8) + buffNeeded[i];
  }
  
  let shard = addr & maskHigh;
  if (shard > numberOfShards - 1) {
      shard = addr & maskLow;
  }
  
  return shard;
}

// Traduce ComputeShardID din Go
private computeShardID2(address, numberOfShards = 3) {
  const { maskHigh, maskLow } = this.calculateMasks(numberOfShards);
  return this.computeIdBasedOfNrOfShardAndMasks(address, numberOfShards, maskHigh, maskLow);
}

// Funcția principală pentru a calcula shard-ul unei adrese bech32
private getShardFromAddress(address, numberOfShards = 3) {
  try {
      // Decodează adresa bech32 pentru a obține bytes-urile
      const decoded = bech32.decode(address)
      const addressBytes = Buffer.from(bech32.fromWords(decoded.words));
      
      // Calculează shard-ul
      return this.computeShardID2(addressBytes, numberOfShards);
  } catch (error) {
      throw new Error(`Invalid bech32 address: ${error.message}`);
  }
}
}
