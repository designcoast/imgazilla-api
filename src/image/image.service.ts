import { HttpStatus, Injectable, Logger } from '@nestjs/common';

import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bullmq';
import { v4 as uuid } from 'uuid';
import { ImageOptimizationDto } from '~/image/dto/optimaze-image.dto';

@Injectable()
export class ImageService {
  private readonly logger = new Logger(ImageService.name);

  constructor(
    @InjectQueue('image-processing') private readonly processingQueue: Queue,
  ) {}
  async optimizeImage(data: ImageOptimizationDto[]): Promise<string> {
    const chunkId = uuid();
    await this.processingQueue.add(chunkId, data, {
      jobId: chunkId,
    });

    return chunkId;
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

  async getImageOptimizationResult(id: string) {
    try {
      const job = await this.processingQueue.getJob(id);

      if (!job) {
        return {
          status: HttpStatus.NOT_FOUND,
          reason: 'Image optimization job not found',
        };
      }

      const result = job.returnvalue;

      return { status: HttpStatus.OK, result };
    } catch (e) {}
  }
}
