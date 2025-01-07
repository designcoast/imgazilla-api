import {
  Controller,
  Get,
  Post,
  Patch,
  Query,
  HttpStatus,
  Body,
  HttpException,
  ForbiddenException,
  Logger,
  UseGuards,
  Param,
} from '@nestjs/common';
import { AccountService } from '~/account/account.service';
import { AccountEntity } from '~/account/entities/account.entity';
import { CreateAccountDto } from '~/account/dto/CreateAccountDto';
import { DecryptHeader } from '~/decorators/decryptHeader';
import { UpdateCreditsDto } from '~/account/dto/UpdateCreditsDto';
import { SecretKeyGuard } from '~/guards/secretKey.guard';

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

  @Patch('bonus')
  async updateBonusAccountCredits(@DecryptHeader() figmaID: string): Promise<{
    message: string;
  }> {
    const BONUS_CREDITS = 500;

    await this.accountService.updateAccountBonusCredits({
      figmaUserID: figmaID,
      credits: BONUS_CREDITS,
    });

    this.logger.log(`Account ${figmaID} bonus credits updated successfully`);

    return { message: 'xo-xo-xo' };
  }

  @Patch(':id/credits')
  @UseGuards(SecretKeyGuard)
  async updateAccountCredits(
    @Param('id') id: string,
    @Body() updateCreditsDto: UpdateCreditsDto,
  ): Promise<any> {
    await this.accountService.updateAccountCreditsNew({
      figmaUserID: id,
      credits: updateCreditsDto.credits,
    });

    this.logger.log(`Account ${id} credits updated successfully`);

    return { message: 'Credits updated successfully' };
  }
}
