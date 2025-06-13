import { Controller, Get, Post, Req, UseGuards, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { NativeAuth, NativeAuthGuard } from '@multiversx/sdk-nestjs-auth';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller()
@ApiBearerAuth()
@UseGuards(NativeAuthGuard)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello( @NativeAuth('address') address: string,): string {
    return this.appService.getHello(address);
  }

  @Post('/login') 
  login(
    @NativeAuth('address') address: string,
  ) {
    return this.appService.login(address);
  }

  @Get('/fund-relayer')
  fundRelayer(
    @NativeAuth('address') address: string,
  ) {
    return this.appService.getFundRelayerTxn(address);
  }

  @Post('/relayer-vote-transaction')
  relayerVoteTransaction(
    @NativeAuth('address') voterAddress: string,
    @Body() {ownerAddress, campaignId, option}: {ownerAddress: string, campaignId: number, option: number}
  ) {
    return this.appService.getRelayerVoteTxn(voterAddress, ownerAddress, campaignId, option);
  }
}
