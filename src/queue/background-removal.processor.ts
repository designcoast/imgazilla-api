import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { BackgroundRemovalService } from '~/backgroundRemoval/backgroundRemoval.service';
import { decode, encode } from 'base64-arraybuffer';

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

      const imageBuffer = Buffer.from(decode(data.image));
      const response =
        await this.backgroundRemovalService.removeImageBackground(imageBuffer);

      return {
        response: encode(response),
        metadata,
      };
    } catch (err) {
      this.logger.error(err);
    }
  }
}
