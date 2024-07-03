import {
  Controller,
  Get,
  Post,
  Query,
  HttpStatus,
  Body,
  HttpException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { AccountService } from '~/account/account.service';
import { AccountEntity } from '~/account/entities/account.entity';
import { CreateAccountDto } from '~/account/dto/CreateAccountDto';
import { DecryptHeader } from '~/decorators/decryptHeader';

@Controller('account')
export class AccountController {
  private readonly logger = new Logger(AccountController.name);

  constructor(private readonly accountService: AccountService) {}
  @Get('getAccount')
  async getAccount(
    @Query('id') id: string,
  ): Promise<NonNullable<unknown> | AccountEntity> {
    const existedAccount =
      await this.accountService.findAccountByFigmaUserId(id);

    if (!existedAccount) {
      this.logger.error(`Account with id: ${id} not found`);
      return {};
    }

    return existedAccount;
  }

  @Post('createAccount')
  async createUserAccount(
    @Body() createAccountDto: CreateAccountDto,
  ): Promise<AccountEntity> {
    const { id, name, photoUrl } = createAccountDto;
    const existedAccount =
      await this.accountService.findAccountByFigmaUserId(id);

    if (existedAccount) {
      throw new HttpException('Account exists', HttpStatus.CONFLICT);
    }

    this.logger.log(
      `Account is created successfully with name ${name} and id ${id}`,
    );

    await this.accountService.createAccount({
      name,
      figmaUserID: id,
      photoUrl,
    });

    return await this.accountService.findAccountByFigmaUserId(id);
  }

  @Get('getAccountCredits')
  async getAccountCredits(@DecryptHeader() figmaID: string): Promise<string> {
    const accountEntity = await this.accountService.getAccountCredits({
      figmaUserID: figmaID,
    });

    if (!accountEntity) {
      this.logger.error(`Account ${figmaID} does not exist`);

      throw new ForbiddenException('Forbidden');
    }

    return accountEntity.credits;
  }
}
