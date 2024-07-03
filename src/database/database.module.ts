import { Module } from '@nestjs/common';
import { ConnectionService } from './connection/connection.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmConfigService } from '~/configs/typeOrmConfigService';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useClass: TypeOrmConfigService,
    }),
  ],
  providers: [ConnectionService],
})
export class DatabaseModule {}
