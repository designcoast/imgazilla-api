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
import { TelegramBotService } from './telegram-bot/telegram-bot.service';
import { TelegramBotModule } from './telegram-bot/telegram-bot.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    // NestjsGrammyModule.forRootAsync({
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    //   useFactory: (configService: ConfigService) => ({
    //     token: configService.get('TELEGRAM_BOT_TOKEN'),
    //   }),
    // }),
    DatabaseModule,
    ArchiveModule,
    AccountModule,
    ImageModule,
    SignalAlertModule,
    TelegramBotModule,
  ],
  controllers: [AppController, FaviconController],
  providers: [AppService, FaviconService, TelegramBotService],
})
export class AppModule {}
