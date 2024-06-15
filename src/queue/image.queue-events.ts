import {
  QueueEventsListener,
  QueueEventsHost,
  OnQueueEvent,
} from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { AccountService } from '~/account/account.service';
import { ConfigService } from '@nestjs/config';

@QueueEventsListener('image-processing')
export class ImageQueueEvents extends QueueEventsHost {
  private readonly logger = new Logger(ImageQueueEvents.name);

  constructor(
    private readonly accountService: AccountService,
    private configService: ConfigService,
  ) {
    super();
  }

  @OnQueueEvent('completed')
  async onCompleted(job: { jobId: string; returnvalue: unknown }) {
    try {
      const imageCreditsCost = this.configService.get('IMAGE_CREDITS_COST');
      const { metadata } = job.returnvalue[0];
      const figmaUserID = metadata?.figmaID;

      const account =
        await this.accountService.findAccountByFigmaUserId(figmaUserID);

      if (!account) {
        this.logger.log(
          `Account not found ${metadata.figmaID} for ${job.jobId} job`,
        );
      }

      const currentCredits = parseInt(account.credits);
      const imageCredits = parseInt(imageCreditsCost);
      const credits = (currentCredits - imageCredits).toString();

      await this.accountService.updateAccountCredits({
        figmaUserID,
        credits,
      });

      this.logger.log(`Job ${job.jobId} completed`);
    } catch (err) {
      this.logger.log(`Job ${job.jobId} completed with error: ${err}`);
    }
  }
}
