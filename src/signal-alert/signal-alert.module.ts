import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SignalAlertService } from '~/signal-alert/signal-alert.service';
import { SignalAlertController } from '~/signal-alert/signal-alert.controller';

@Module({
  imports: [ConfigModule],
  controllers: [SignalAlertController],
  providers: [ConfigService, SignalAlertService],
})
export class SignalAlertModule {}
