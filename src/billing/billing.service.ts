import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  RawBodyRequest,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import * as crypto from 'crypto';
import { EVENT_ORDER_CREATED, PRICE_TO_CREDITS_NUMBER } from '~/constants';
import { AccountService } from '~/account/account.service';

@Injectable()
export class BillingService {
  private readonly logger = new Logger(BillingService.name);
  private readonly configService: ConfigService;

  constructor(private readonly accountService: AccountService) {
    this.configService = new ConfigService();
  }

  async verifySignature(
    request: RawBodyRequest<Request>,
    signatureHeader: string,
  ) {
    try {
      const hmac = crypto.createHmac(
        'sha256',
        this.configService.get('LEMONSQUEEZY_WEBHOOK_SECRET'),
      );

      const digest = Buffer.from(
        hmac.update(request.rawBody).digest('hex'),
        'utf8',
      );
      const signature = Buffer.from(signatureHeader || '', 'utf8');

      return crypto.timingSafeEqual(digest, signature);
    } catch (e) {
      this.logger.error(e);
    }
  }

  async handleOrder(eventName: string, data: any, meta: any) {
    try {
      this.logger.log(`Order received from ${eventName}`);
      if (eventName === EVENT_ORDER_CREATED) {
        const figmaUserID = meta?.custom_data?.figma_user_id;
        const account =
          await this.accountService.findAccountByFigmaUserId(figmaUserID);

        if (!account) {
          return HttpStatus.NOT_FOUND;
        }

        const numberOfCreditsByPrice =
          PRICE_TO_CREDITS_NUMBER[data.attributes.total] || 0;

        const currentCredits = parseInt(account.credits);
        const credits = (currentCredits + numberOfCreditsByPrice).toString();

        await this.accountService.updateAccountCredits({
          figmaUserID,
          credits,
        });
      }
      return HttpStatus.OK;
    } catch (e) {
      throw new HttpException('Webhook exception error:', e);
    }
  }
}
