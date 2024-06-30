import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.configService.get<string>('POSTGRES_DATABASE_HOST'),
      port: this.configService.get<number>('POSTGRES_DATABASE_PORT'),
      username: this.configService.get<string>('POSTGRES_DATABASE_USER'),
      password: this.configService.get<string>('POSTGRES_DATABASE_PASSWORD'),
      database: this.configService.get<string>('POSTGRES_DATABASE_NAME'),
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: this.configService.get<string>('NODE_ENV') !== 'production',
    };
  }
}
