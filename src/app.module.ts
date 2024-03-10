import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FaviconController } from './favicon/favicon.controller';
import { FaviconService } from './favicon/favicon.service';
import { ArchiveModule } from './archive/archive.module';
import { AccountModule } from './account/account.module';
import { ImageModule } from './image/image.module';
import { CoinService } from '~/coin/coin.service';
import { CoinModule } from '~/coin/coin.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
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
    ArchiveModule,
    AccountModule,
    ImageModule,
    CoinModule,
  ],
  controllers: [AppController, FaviconController],
  providers: [AppService, FaviconService, CoinService],
})
export class AppModule {}
