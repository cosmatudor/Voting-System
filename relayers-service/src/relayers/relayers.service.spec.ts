import { Test, TestingModule } from '@nestjs/testing';
import { RelayersService } from './relayers.service';

describe('RelayersService', () => {
  let service: RelayersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RelayersService],
    }).compile();

    service = module.get<RelayersService>(RelayersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
