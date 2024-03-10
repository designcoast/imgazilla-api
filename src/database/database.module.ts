import { Module } from '@nestjs/common';
import { ConnectionService } from './connection/connection.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mongodb',
        autoLoadEntities: true,
        url:
          configService.get('NODE_ENV') === 'production'
            ? `mongodb://${configService.get(
                'MONGO_INITDB_ROOT_USERNAME',
              )}:${configService.get(
                'MONGO_INITDB_ROOT_PASSWORD',
              )}@mongodb:${configService.get(
                'MONGO_DB_PORT',
              )}/${configService.get('MONGO_INITDB_DATABASE')}?authSource=admin`
            : `mongodb://${configService.get(
                'MONGO_INITDB_ROOT_USERNAME',
              )}:${configService.get(
                'MONGO_INITDB_ROOT_PASSWORD',
              )}@${configService.get('MONGO_DB_URL')}:${configService.get(
                'MONGO_DB_PORT',
              )}/${configService.get(
                'MONGO_INITDB_DATABASE',
              )}?authSource=admin`,
      }),
    }),
  ],
  providers: [ConnectionService],
})
export class DatabaseModule {}
