import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bullmq';

import { v4 as uuid } from 'uuid';

import { gradioClient } from '~/utils/gradioClient.utils';
import { fetchImageAsBuffer } from '~/utils/fetchImageAsBuffer';
import {
  BackgroundRemovalDto,
  BackgroundRemovalMetadata,
} from '~/backgroundRemoval/dto/remove-background.dto';

@Injectable()
export class BackgroundRemovalService {
  private readonly logger = new Logger(BackgroundRemovalService.name);

  constructor(
    @InjectQueue('background-removal') private readonly processingQueue: Queue,
  ) {}

  async getBackgroundRemovalProcessId(
    data: BackgroundRemovalDto,
    metadata: BackgroundRemovalMetadata,
  ): Promise<{ jobId: string }> {
    const jobId = uuid();

    await this.processingQueue.add(
      jobId,
      {
        data,
        metadata,
      },
      {
        jobId,
      },
    );

    return {
      jobId,
    };
  }

  async getBackgroundRemovalStatus(id: string) {
    try {
      const job = await this.processingQueue.getJob(id);

      if (!job) {
        return {
          status: HttpStatus.NOT_FOUND,
          reason: 'Background removal job not found',
        };
      }

      return {
        status: job.finishedOn
          ? HttpStatus.OK
          : job.failedReason
            ? HttpStatus.FAILED_DEPENDENCY
            : HttpStatus.PROCESSING,
      };
    } catch (e) {
      this.logger.error(e);
    }
  }

  async getBackgroundRemovalResult(id: string, figmaAccountID: string) {
    try {
      const job = await this.processingQueue.getJob(id);

      if (!job) {
        return {
          status: HttpStatus.NOT_FOUND,
          reason: 'Background removal job not found',
        };
      }

      const { metadata, response: imageBuffer } = job.returnvalue;

      if (metadata?.figmaID !== figmaAccountID) {
        return { status: HttpStatus.NOT_FOUND, result: null };
      }

      await this.processingQueue.remove(id);

      return { status: HttpStatus.OK, result: imageBuffer };
    } catch (e) {
      this.logger.error(e);
    }
  }

  async removeImageBackground(imageData: Uint8Array) {
    try {
      const client = await gradioClient();
      const result = await client.predict('/predict', {
        input_path: imageData,
        param_8: '',
      });
      const imageURL = result.data[0].url;
      return await fetchImageAsBuffer(imageURL);
    } catch (e) {
      this.logger.error(e);
    }
  }
}
