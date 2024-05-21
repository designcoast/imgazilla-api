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
  onCompleted(jobId) {
    this.logger.debug('Start completed event...');
    // this.logger.debug(jobId);
    console.log('jobId', jobId);
    this.logger.debug('Finishing completed event');
    return 'hi';
  }
}
