import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';

import { ImageQueueProcessor } from '~/queue/image.processor';
import { ImageService } from '~/image/image.service';
import { ImageQueueEvents } from '~/queue/image.queue-events';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.get('BULL_REDIS_HOST'),
          port: configService.get('BULL_REDIS_PORT'),
          password: configService.get('BULL_REDIS_PASSWORD'),
        },
      }),
    }),
    BullModule.registerQueue({
      name: 'image-processing',
    }),
  ],
  providers: [ImageQueueEvents, ImageQueueProcessor, ImageService],
  exports: [BullModule],
})
export class ImageQueueModule {}
