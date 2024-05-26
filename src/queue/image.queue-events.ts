import {
  QueueEventsListener,
  QueueEventsHost,
  OnQueueEvent,
} from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';

@QueueEventsListener('image-processing')
export class ImageQueueEvents extends QueueEventsHost {
  private readonly logger = new Logger(ImageQueueEvents.name);

  @OnQueueEvent('completed')
  onCompleted(job: { jobId: string; returnvalue: unknown }) {
    this.logger.log(`Job ${job.jobId} completed`);
  }
}
