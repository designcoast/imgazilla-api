import { Processor, Process, OnQueueCompleted } from '@nestjs/bull';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';

import { ImageService } from '~/image/image.service';

@Processor('image-processing')
export class ImageQueueProcessor {
  private readonly logger = new Logger(ImageQueueProcessor.name);
  constructor(private readonly imageService: ImageService) {}

  @Process()
  async handleProcessing(job: Job) {
    return await this.imageService.optimizeImage(job.data);
  }

  @OnQueueCompleted()
  async onImageProcessCompleted(job: Job) {}
}
