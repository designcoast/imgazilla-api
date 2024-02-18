import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FaviconController } from './favicon/favicon.controller';
import { FaviconService } from './favicon/favicon.service';
import { ArchiveModule } from './archive/archive.module';
import { AccountModule } from './account/account.module';
import { ImageModule } from './image/image.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [ArchiveModule, AccountModule, ImageModule, DatabaseModule],
  controllers: [AppController, FaviconController],
  providers: [AppService, FaviconService],
})
export class AppModule {}
