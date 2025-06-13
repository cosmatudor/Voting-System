import { MxnestConfigService } from '@multiversx/sdk-nestjs-common';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ContractConfigService implements MxnestConfigService {
constructor(private readonly configService: ConfigService) {}

getSecurityAdmins(): string[] {
    throw new Error('Method not implemented.');
}

getJwtSecret(): string {
    throw new Error('Method not implemented.');
}

getNativeAuthMaxExpirySeconds(): number {
    return parseInt(
        this.configService.get('NATIVE_AUTH_MAX_EXPIRY_SECONDS')
    )
}

getNativeAuthAcceptedOrigins(): string[] {
    return this.configService.get('NATIVE_AUTH_ACCEPTED_ORIGINS').split(',');
}

getContractAddress(): string {
return this.configService.get('CONTRACT_ADDRESS');
}

getApiUrl(): string {
return this.configService.get('API_URL');
}

getChainId(): string {
return this.configService.get('CHAIN_ID');
}

}