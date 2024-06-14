import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  RawBodyRequest,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import * as crypto from 'crypto';
import { EVENT_ORDER_CREATED } from '~/constants';
import { AccountService } from '~/account/account.service';

@Injectable()
export class BillingService {
  private readonly logger = new Logger(BillingService.name);
  private readonly configService: ConfigService;
  private readonly accountService: AccountService;

  constructor() {
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
      if (eventName === EVENT_ORDER_CREATED) {
        console.log('eventName', eventName);
        console.log('data', data.attributes.total);
        console.log('meta', meta);
      }

      return HttpStatus.OK;
    } catch (e) {
      throw new HttpException('Webhook exception error:', e);
    }
  }
}
