import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FaviconController } from './favicon/favicon.controller';
import { FaviconService } from './favicon/favicon.service';
import { ArchiveModule } from './archive/archive.module';
import { AccountModule } from './account/account.module';
import { ImageModule } from './image/image.module';
import { DatabaseModule } from '~/database/database.module';
import { SignalAlertModule } from '~/signal-alert/signal-alert.module';
import { TelegramService } from '~/telegram/telegram.service';
import { TelegramModule } from '~/telegram/telegram.module';
import { APP_FILTER } from '@nestjs/core';
import { ExceptionsFilter } from '~/filters/exceptions.filter';
import { TelegramConfigService } from '~/telegram/telegram.config';
import { SignalLoggerService } from '~/loggers/signal-logger.service';
import { SignalAlertService } from '~/signal-alert/signal-alert.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule,
    ArchiveModule,
    AccountModule,
    ImageModule,
    SignalAlertModule,
    TelegramModule,
  ],
  controllers: [AppController, FaviconController],
  providers: [
    AppService,
    FaviconService,
    TelegramService,
    {
      provide: APP_FILTER,
      useClass: ExceptionsFilter,
    },
    TelegramConfigService,
    {
      provide: 'Bot',
      useFactory: (telegramConfigService: TelegramConfigService) =>
        telegramConfigService.getBot(),
      inject: [TelegramConfigService],
    },
    SignalLoggerService,
    SignalAlertService,
  ],
})
export class AppModule {}
