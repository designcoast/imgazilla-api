import { Logger, Module } from '@nestjs/common';
import { BillingController } from './billing.controller';
import { BillingService } from './billing.service';
import { AccountModule } from '~/account/account.module';

@Module({
  imports: [AccountModule],
  controllers: [BillingController],
  providers: [BillingService, Logger],
})
export class BillingModule {}
