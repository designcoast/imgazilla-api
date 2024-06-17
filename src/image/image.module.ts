import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ImageController } from './image.controller';
import { ImageService } from './image.service';
import { ImageQueueModule } from '~/queue/image-queue.module';
import { AccountModule } from '~/account/account.module';

@Module({
  imports: [ImageQueueModule, AccountModule],
  controllers: [ImageController],
  providers: [ImageService, ConfigService],
})
export class ImageModule {}
