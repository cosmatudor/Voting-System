import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity/user.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UserEntity)
        private usersRepository: Repository<UserEntity>,
    ) {}

    async findByAddress(address: string): Promise<UserEntity | null> {
        return this.usersRepository.findOne({ where: { address } });
    }

    async createUser(address: string): Promise<UserEntity> {
        const user = this.usersRepository.create({ address });
        return this.usersRepository.save(user);
    }
}
