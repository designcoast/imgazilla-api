import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccountEntity } from '~/account/entities/account.entity';
import { Repository } from 'typeorm';
import { DEFAULT_CREDITS_NUMBER } from '~/constants';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(AccountEntity)
    private readonly accountRepository: Repository<AccountEntity>,
    private readonly configService: ConfigService,
  ) {}

  async findAccountByFigmaUserId(id: string): Promise<AccountEntity> {
    return await this.accountRepository.findOne({
      select: ['name', 'photoUrl', 'figmaUserID', 'credits'],
      where: { figmaUserID: id },
    });
  }

  async createAccount(input: {
    figmaUserID: string;
    name: string;
    photoUrl: string;
  }): Promise<AccountEntity> {
    return await this.accountRepository.save({
      figmaUserID: input.figmaUserID,
      name: input.name,
      credits: DEFAULT_CREDITS_NUMBER,
      photoUrl: input?.photoUrl,
    });
  }

  async getAccountCredits(input: {
    figmaUserID: string;
  }): Promise<AccountEntity> {
    return await this.accountRepository.findOne({
      select: ['credits'],
      where: { figmaUserID: input.figmaUserID },
    });
  }

  async updateAccountCredits(input: {
    figmaUserID: string;
    credits: string;
  }): Promise<void> {
    const account = await this.findAccountByFigmaUserId(input.figmaUserID);

    if (!account) {
      throw new HttpException('Account not found', HttpStatus.NOT_FOUND);
    }

    await this.accountRepository.update(
      { figmaUserID: input.figmaUserID },
      {
        credits: input.credits,
      },
    );
  }

  async checkAccountCredits(figmaID: string) {
    const accountEntity = await this.getAccountCredits({
      figmaUserID: figmaID,
    });

    if (!accountEntity) {
      throw new ForbiddenException('Forbidden');
    }

    const credits = parseInt(accountEntity.credits);
    const IMAGE_CREDITS_COST = this.configService.get('IMAGE_CREDITS_COST');

    if (credits < IMAGE_CREDITS_COST) {
      throw new HttpException(
        "It looks like you don't have enough credits to complete this operation.",
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
  }
}
