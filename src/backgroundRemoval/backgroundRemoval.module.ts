import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ImageQueueModule } from '~/queue/image-queue.module';
import { AccountModule } from '~/account/account.module';
import { BackgroundRemovalController } from '~/backgroundRemoval/backgroundRemoval.controller';
import { BackgroundRemovalService } from '~/backgroundRemoval/backgroundRemoval.service';

@Module({
  imports: [ImageQueueModule, AccountModule],
  controllers: [BackgroundRemovalController],
  providers: [BackgroundRemovalService, ConfigService],
})
export class BackgroundRemovalModule {}
