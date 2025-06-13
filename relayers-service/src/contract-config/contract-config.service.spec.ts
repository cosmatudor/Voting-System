import { Test, TestingModule } from '@nestjs/testing';
import { ContractConfigService } from './contract-config.service';

describe('ContractConfigService', () => {
  let service: ContractConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContractConfigService],
    }).compile();

    service = module.get<ContractConfigService>(ContractConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
