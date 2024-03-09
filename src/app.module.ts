import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

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
    TypeOrmModule.forRoot({
      type: 'mongodb',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      autoLoadEntities: true,

      synchronize: process.env.NODE_ENV !== 'production',
      logging: process.env.NODE_ENV !== 'production',
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
