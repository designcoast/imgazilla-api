import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { BackupService } from './backup.service';
import { BackupController } from './backup.controller';
import { SignalAlertModule } from '~/signal-alert/signal-alert.module';
import { TelegramConfigService } from '~/telegram/telegram.config';
import { SignalAlertService } from '~/signal-alert/signal-alert.service';

@Module({
  imports: [SignalAlertModule],
  providers: [
    ConfigService,
    BackupService,
    {
      provide: 'Bot',
      useFactory: (telegramConfigService: TelegramConfigService) =>
        telegramConfigService.getBot(),
      inject: [TelegramConfigService],
    },
    TelegramConfigService,
    SignalAlertService,
  ],
  controllers: [BackupController],
})
export class BackupModule {}
