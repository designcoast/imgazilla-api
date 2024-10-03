import { Inject, Injectable, Logger } from '@nestjs/common';
import { Bot, InputFile } from 'grammy';
import { ConfigService } from '@nestjs/config';
import { Readable } from 'stream';

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

  async sendDocument(backupStream: Readable) {
    const chatId = `-${this.configService.get('TELEGRAM_BACKUP_CHAT_ID')}`;

    const fileName = `backup_${new Date().toISOString().replace(/[:.]/g, '-')}.zip`;

    const inputFile = new InputFile(backupStream, fileName);

    try {
      await this.bot.api.sendDocument(chatId, inputFile, {
        caption: `Database backup created on ${new Date().toLocaleString()}`,
      });
      this.logger.log('Document sent to Telegram successfully.');
    } catch (error) {
      this.logger.error('Failed to send Document to Telegram', error);
    }
  }
}
