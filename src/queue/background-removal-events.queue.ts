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
  async onComplete(job: {
    jobId: string;
    returnvalue: { response: unknown; metadata: { figmaID: string } };
  }) {
    try {
      const { metadata } = job.returnvalue;
      const figmaUserID = metadata?.figmaID;

      const backgroundRemovalCost = this.configService.get(
        'BACKGROUND_REMOVAL_COST',
      );

      const account =
        await this.accountService.findAccountByFigmaUserId(figmaUserID);

      if (!account) {
        this.logger.log(
          `Account not found ${metadata.figmaID} for ${job.jobId} job`,
        );
      }

      const currentCredits = parseInt(account.credits);
      const imageCredits = parseInt(backgroundRemovalCost);
      const credits = (currentCredits - imageCredits).toString();

      await this.accountService.updateAccountCredits({
        figmaUserID,
        credits,
      });

      this.logger.log(`Background removal job ${job.jobId} completed`);
    } catch (err) {
      this.logger.log(
        `Background removal job ${job.jobId} completed with error: ${err}`,
      );
    }
  }
}
