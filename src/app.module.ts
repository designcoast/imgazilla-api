import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FaviconController } from './favicon/favicon.controller';
import { FaviconService } from './favicon/favicon.service';

@Module({
  imports: [],
  controllers: [AppController, FaviconController],
  providers: [AppService, FaviconService],
})
export class AppModule {}
