import { Injectable, Logger, RawBodyRequest } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import crypto from 'crypto';

@Injectable()
export class BillingService {
  private readonly logger = new Logger(BillingService.name);
  private readonly configService: ConfigService;

  constructor() {
    this.configService = new ConfigService();
  }
  async getPlane() {}

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
}
