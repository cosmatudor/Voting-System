// src/relayers/entities/relayer.entity/relayer.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne } from 'typeorm';
import { UserEntity } from '../../../users/entities/user.entity/user.entity';

@Entity('relayers')
export class RelayerEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  publicKey: string;

  @Column()
  encryptedPrivateKey: string;

  @Column()
  shardId: number

  @ManyToOne(() => UserEntity, user => user.relayers, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: UserEntity;
}