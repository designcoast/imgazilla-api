import {
  Body,
  Controller,
  Get,
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
    @Body() body: any,
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
    console.log('webhook', body);
    console.log('signature', signature);
    console.log('eventName', eventName);
    console.log('request.rawBody', request.rawBody);
    // Verify the webhook signature (implement your own verification logic)
    // if (this.paymentService.verifySignature(body, signature)) {
    // await this.billingService.handlePaymentWebhook(body);
    // return { message: 'Webhook processed' };
    // }
    // return { message: 'Invalid signature' };
  }
}
