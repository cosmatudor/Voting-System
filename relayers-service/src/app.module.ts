import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { RelayersModule } from './relayers/relayers.module';
import { MXNEST_CONFIG_SERVICE } from '@multiversx/sdk-nestjs-common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ContractConfigService } from './contract-config/contract-config.service';
import { RelayerEntity } from './relayers/entities/relayer.entity/relayer.entity';
import { UserEntity } from './users/entities/user.entity/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [RelayersModule, UsersModule, ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST'),
        port: +config.get<number>('DB_PORT'),
        username: config.get('DB_USERNAME'),
        password: config.get('DB_PASSWORD'),
        database: config.get('DB_DATABASE'),
        entities: [UserEntity, RelayerEntity],
        synchronize: true, // doar pentru development!
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([UserEntity]),
    TypeOrmModule.forFeature([RelayerEntity]),
  ],
  controllers: [AppController],
  providers: [AppService, 
    {
      provide: MXNEST_CONFIG_SERVICE,
      useClass: ContractConfigService
    }
  ],
})
export class AppModule {}
