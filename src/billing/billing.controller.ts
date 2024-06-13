import {
  Body,
  Controller,
  Headers,
  Logger,
  Post,
  RawBodyRequest,
  Req,
} from '@nestjs/common';
import { BillingService } from '~/billing/billing.service';

@Controller('billing')
export class BillingController {
  constructor(
    private readonly billingService: BillingService,
    private readonly logger: Logger,
  ) {}

  @Post('webhook')
  async handleWebhook(
    @Body('meta') meta: any,
    @Body('data') data: any,
    @Headers('X-Signature') signature: string,
    @Headers('X-Event-Name') eventName: string,
    @Req() request: RawBodyRequest<Request>,
  ) {
    const isVerified = await this.billingService.verifySignature(
      request,
      signature,
    );
    if (!isVerified) {
      this.logger.error('Signature verification failed');
      return;
    }

    return await this.billingService.handleOrder(eventName, data, meta);
  }
}
