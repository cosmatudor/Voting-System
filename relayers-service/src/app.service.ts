import { Injectable } from '@nestjs/common';
import { UsersService } from './users/users.service';
import { RelayersService } from './relayers/relayers.service';

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

    let relayer = await this.relayersService.getRelayerForUserAddress(address);
    if (!relayer) {
      relayer = await this.relayersService.createRelayer(address);
    }

    return {
      user,
      relayer,
    };
  }

  async getFundRelayerTxn(address: string) {
    const relayer = await this.relayersService.getRelayerForUserAddress(address);
    if (!relayer) {
      throw new Error('Relayer not found');
    }

     const tx = await this.relayersService.composeFundingTransaction(address, relayer);
     return { transaction: tx };
  }

  async getRelayerVoteTxn(voterAddress: string, ownerAddress: string, campaignId: number, option: number) {
    const relayer = await this.relayersService.getRelayerForUserAddress(ownerAddress);
    if (!relayer) {
      throw new Error('Relayer not found');
    }

    const tx = await this.relayersService.composeRelayerVoteTransaction(voterAddress, relayer, campaignId, option);
    return { transaction: tx };
  }

}
