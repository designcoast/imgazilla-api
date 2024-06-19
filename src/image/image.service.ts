import { HttpStatus, Injectable, Logger } from '@nestjs/common';

import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bullmq';
import { v4 as uuid } from 'uuid';
import {
  ImageOptimizationDto,
  ImageOptimizationMetadata,
} from '~/image/dto/optimaze-image.dto';
import { ImageOptimizationResult } from '~/types';

@Injectable()
export class ImageService {
  private readonly logger = new Logger(ImageService.name);

  constructor(
    @InjectQueue('image-processing') private readonly processingQueue: Queue,
  ) {}
  async optimizeImage(
    data: ImageOptimizationDto[],
    metadata: ImageOptimizationMetadata,
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

  async getImageStatus(id: string) {
    try {
      const job = await this.processingQueue.getJob(id);

      if (!job) {
        return {
          status: HttpStatus.NOT_FOUND,
          reason: 'Image optimization job not found',
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

  async getImageOptimizationResult(id: string, figmaAccountID: string) {
    try {
      const job = await this.processingQueue.getJob(id);

      if (!job) {
        return {
          status: HttpStatus.NOT_FOUND,
          reason: 'Image optimization job not found',
        };
      }
      const { metadata } = job.returnvalue[0];

      const result = job.returnvalue.map(
        (item: { response: ImageOptimizationResult }) => item.response,
      );

      if (metadata?.figmaID !== figmaAccountID) {
        return { status: HttpStatus.NOT_FOUND, result: [] };
      }

      return { status: HttpStatus.OK, result };
    } catch (e) {}
  }
}
