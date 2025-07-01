import { Entity, PrimaryColumn, OneToMany } from 'typeorm';
import { RelayerEntity } from '../../../relayers/entities/relayer.entity/relayer.entity';

@Entity('users')
export class UserEntity {
  @PrimaryColumn()
  address: string;

  @OneToMany(() => RelayerEntity, relayer => relayer.user)
  relayers: RelayerEntity[];
}