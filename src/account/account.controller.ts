import { Controller, Get, Post, Param, Query } from '@nestjs/common';

@Controller('account')
export class AccountController {
  constructor() {}
  @Get('check')
  async check(
    @Query('id') id: string,
    @Query('name') name: string,
  ): Promise<any> {
    console.log('ID: ', id);
    console.log('Name: ', name);

    return 'check user account';
  }
  @Post('create')
  async createUserAccount(): Promise<any> {}
}
