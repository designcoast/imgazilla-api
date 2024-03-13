import { Controller, Get, Post, Query, HttpStatus, Body } from '@nestjs/common';
import { AccountService } from '~/account/account.service';
import { AccountEntity } from '~/account/entities/account.entity';
import { CreateAccountDto } from '~/account/dto/CreateAccountDto';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}
  @Get('check')
  async check(@Query('id') id: string): Promise<boolean | AccountEntity> {
    const existedAccount =
      await this.accountService.findAccountByFigmaUserId(id);

    if (!existedAccount) {
      return false;
    }

    return existedAccount;
  }
  @Post('create')
  async createUserAccount(
    @Body() createAccountDto: CreateAccountDto,
  ): Promise<{ status: HttpStatus }> {
    const { id, name } = createAccountDto;
    const existedAccount =
      await this.accountService.findAccountByFigmaUserId(id);

    if (existedAccount) {
      return {
        status: HttpStatus.CONFLICT,
      };
    }

    await this.accountService.createAccount({
      name,
      figmaUserID: id,
    });
    return {
      status: HttpStatus.CREATED,
    };
  }
}
