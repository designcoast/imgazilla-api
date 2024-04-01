import { Injectable } from '@nestjs/common';
import { Bot } from 'grammy';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SignalAlertService {
  private bot: Bot;

  constructor(private configService: ConfigService) {
    this.bot = new Bot(this.configService.get('TELEGRAM_BOT_TOKEN'));
    this.bot.init();
  }

  async logCriticalIssue(message: string) {
    await this.bot.api.sendMessage(
      `-${this.configService.get('TELEGRAM_CHAT_ID')}`,
      message,
    );
  }
}
