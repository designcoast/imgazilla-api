import {
  Controller,
  Get,
  Post,
  Query,
  HttpStatus,
  Body,
  HttpException,
  ForbiddenException,
} from '@nestjs/common';
import { AccountService } from '~/account/account.service';
import { AccountEntity } from '~/account/entities/account.entity';
import { CreateAccountDto } from '~/account/dto/CreateAccountDto';
import { DecryptHeader } from '~/decorators/decryptHeader';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}
  @Get('getAccount')
  async getAccount(
    @Query('id') id: string,
  ): Promise<HttpStatus.NOT_FOUND | AccountEntity> {
    const existedAccount =
      await this.accountService.findAccountByFigmaUserId(id);

    if (!existedAccount) {
      throw new HttpException('Account not found', HttpStatus.NOT_FOUND);
    }

    return existedAccount;
  }

  @Post('createAccount')
  async createUserAccount(
    @Body() createAccountDto: CreateAccountDto,
  ): Promise<{ status: HttpStatus }> {
    const { id, name, photoUrl } = createAccountDto;
    const existedAccount =
      await this.accountService.findAccountByFigmaUserId(id);

    if (existedAccount) {
      throw new HttpException('Account exists', HttpStatus.CONFLICT);
    }

    await this.accountService.createAccount({
      name,
      figmaUserID: id,
      photoUrl,
    });

    return {
      status: HttpStatus.CREATED,
    };
  }

  @Get('getAccountCredits')
  async getAccountCredits(@DecryptHeader() figmaID: string): Promise<string> {
    const accountEntity = await this.accountService.getAccountCredits({
      figmaUserID: figmaID,
    });

    if (!accountEntity) {
      throw new ForbiddenException('Forbidden');
    }

    return accountEntity.credits;
  }
}
