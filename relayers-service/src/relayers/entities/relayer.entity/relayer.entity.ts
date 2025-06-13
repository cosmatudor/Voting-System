// src/relayers/entities/relayer.entity/relayer.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { UserEntity } from '../../../users/entities/user.entity/user.entity';

@Entity('relayers')
export class RelayerEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  publicKey: string;

  @Column()
  encryptedPrivateKey: string;

  @OneToOne(() => UserEntity, user => user.relayer, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: UserEntity;
}