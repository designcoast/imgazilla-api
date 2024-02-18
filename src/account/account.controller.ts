import { Controller, Get } from '@nestjs/common';

@Controller('account')
export class AccountController {
  constructor() {}
  @Get('check')
  async check(): Promise<any> {
    return 'check user account';
  }
}
