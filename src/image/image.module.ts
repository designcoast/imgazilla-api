import { Module } from '@nestjs/common';
import { ImageController } from './image.controller';
import { ImageService } from './image.service';
import { ImageQueueModule } from '~/queue/image-queue.module';

@Module({
  imports: [ImageQueueModule],
  controllers: [ImageController],
  providers: [ImageService],
})
export class ImageModule {}
