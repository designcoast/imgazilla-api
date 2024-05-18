import { Inject, Injectable, Logger } from '@nestjs/common';
import { Bot } from 'grammy';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SignalAlertService {
  private readonly logger = new Logger(SignalAlertService.name);
  private readonly configService: ConfigService;

  constructor(@Inject('Bot') private readonly bot: Bot) {
    this.configService = new ConfigService();
  }

  async sendAlert(message: string): Promise<void> {
    const chatId = `-${this.configService.get('TELEGRAM_CHAT_ID')}`;

    try {
      await this.bot.api.sendMessage(chatId, message);
      this.logger.log('Alert sent to Telegram successfully.');
    } catch (error) {
      this.logger.error('Failed to send alert to Telegram', error);
    }
  }
}
