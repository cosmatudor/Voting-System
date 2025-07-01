import { Injectable } from '@nestjs/common';
import { UsersService } from './users/users.service';
import { RelayersService } from './relayers/relayers.service';
import { RelayerEntity } from './relayers/entities/relayer.entity/relayer.entity';

@Injectable()
export class AppService {
  constructor(private readonly usersService: UsersService, private readonly relayersService: RelayersService) {}
  
  getHello(address: string): string {
    return `Hello ${address}`;
  }

  async login(address: string) {
    let user = await this.usersService.findByAddress(address);
    if (!user) {
      user = await this.usersService.createUser(address);
    }

    let relayers = await this.relayersService.getAllRelayersForCreator(address);
    if (relayers.length) {
      return relayers;
    }

    return await this.relayersService.createRelayer(address);
  }

  async getFundRelayerTxn(address: string) {
    const relayers = await this.relayersService.getAllRelayersForCreator(address);
    if (relayers.length == 0) {
      throw new Error('Relayer not found');
    }

     const txs = await this.relayersService.composeFundingTransaction(address, relayers);
     return { transactions: txs };
  }

  async getRelayerVoteTxn(voterAddress: string, ownerAddress: string, campaignId: number, option: number) {
    const relayer = await this.relayersService.getRelayerForVoter(ownerAddress, voterAddress);
    if (!relayer) {
      throw new Error('Relayer not found');
    }

    console.log("AICICICICICI:", relayer)

    const tx = await this.relayersService.composeRelayerVoteTransaction(voterAddress, relayer, campaignId, option);
    return { transaction: tx };
  }

}
