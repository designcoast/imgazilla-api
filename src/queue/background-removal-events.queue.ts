import {
  OnQueueEvent,
  QueueEventsHost,
  QueueEventsListener,
} from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { AccountService } from '~/account/account.service';
import { ConfigService } from '@nestjs/config';

@QueueEventsListener('background-removal')
export class BackgroundRemovalEventsQueue extends QueueEventsHost {
  private readonly logger = new Logger(BackgroundRemovalEventsQueue.name);

  constructor(
    private readonly accountService: AccountService,
    private configService: ConfigService,
  ) {
    super();
  }

  @OnQueueEvent('completed')
  async onComplete(job: { jobId: string; returnvalue: unknown }) {}
}
