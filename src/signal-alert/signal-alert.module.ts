import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { SignalAlertService } from '~/signal-alert/signal-alert.service';
import { SignalAlertController } from '~/signal-alert/signal-alert.controller';
import { TelegramConfigService } from '~/telegram/telegram.config';

@Module({
  imports: [ConfigModule],
  controllers: [SignalAlertController],
  providers: [
    ConfigService,
    TelegramConfigService,
    {
      provide: 'Bot',
      useFactory: (telegramConfigService: TelegramConfigService) =>
        telegramConfigService.getBot(),
      inject: [TelegramConfigService],
    },
    SignalAlertService,
  ],
})
export class SignalAlertModule {}
