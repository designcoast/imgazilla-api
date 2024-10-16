import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { BackgroundRemovalService } from '~/backgroundRemoval/backgroundRemoval.service';

@Processor('background-removal')
export class BackgroundRemovalQueueProcessor extends WorkerHost {
  private readonly logger = new Logger(BackgroundRemovalQueueProcessor.name);

  constructor(
    private readonly backgroundRemovalService: BackgroundRemovalService,
  ) {
    super();
  }

  async process(job: Job) {
    try {
      const { data, metadata } = job.data;

      const imageBuffer = Buffer.from(data.image, 'base64');
      const response =
        await this.backgroundRemovalService.removeImageBackground(imageBuffer);

      return {
        response,
        metadata,
      };
    } catch (err) {
      this.logger.error(err);
    }
  }
}
