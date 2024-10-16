import { Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';

import { ThrottlerModule } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { FaviconController } from './favicon/favicon.controller';
import { FaviconService } from './favicon/favicon.service';

import { ArchiveModule } from './archive/archive.module';
import { AccountModule } from './account/account.module';

import { ImageModule } from './image/image.module';
import { DatabaseModule } from '~/database/database.module';

import { SignalAlertModule } from '~/signal-alert/signal-alert.module';
import { SignalAlertService } from '~/signal-alert/signal-alert.service';

import { TelegramConfigService } from '~/telegram/telegram.config';
import { TelegramService } from '~/telegram/telegram.service';
import { TelegramModule } from '~/telegram/telegram.module';

import { ExceptionsFilter } from '~/filters/exceptions.filter';
import { SignalLoggerService } from '~/loggers/signal-logger.service';
import { ImageQueueModule } from '~/queue/image-queue.module';
import { BillingModule } from './billing/billing.module';
import { HeadersGuard } from '~/guards/headers.guard';
import { BackupModule } from '~/backup/backup.module';
import { BackgroundRemovalModule } from '~/backgroundRemoval/backgroundRemoval.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot(),
    DatabaseModule,
    ArchiveModule,
    AccountModule,
    ImageModule,
    BackgroundRemovalModule,
    SignalAlertModule,
    TelegramModule,
    ImageQueueModule,
    BillingModule,
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 20,
      },
    ]),
    BackupModule,
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
    {
      provide: APP_GUARD,
      useClass: HeadersGuard,
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
