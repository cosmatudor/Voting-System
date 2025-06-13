import { Entity, PrimaryColumn, OneToOne } from 'typeorm';
import { RelayerEntity } from '../../../relayers/entities/relayer.entity/relayer.entity';

@Entity('users')
export class UserEntity {
  @PrimaryColumn()
  address: string;

  @OneToOne(() => RelayerEntity, relayer => relayer.user)
  relayer: RelayerEntity;
}