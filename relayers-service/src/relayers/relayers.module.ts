import { Module } from '@nestjs/common';
import { RelayersService } from './relayers.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RelayerEntity } from './entities/relayer.entity/relayer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RelayerEntity])],
  providers: [RelayersService],
  exports: [RelayersService],
})
export class RelayersModule {}
