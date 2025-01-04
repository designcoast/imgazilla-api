import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccountEntity } from '~/account/entities/account.entity';
import { Repository } from 'typeorm';
import {
  BACKGROUND_REMOVAL_ENTITY_TYPE,
  DEFAULT_CREDITS_NUMBER,
  FAVICON_ENTITY_TYPE,
  IMAGE_ENTITY_TYPE,
} from '~/constants';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(AccountEntity)
    private readonly accountRepository: Repository<AccountEntity>,
    private readonly configService: ConfigService,
  ) {}

  async findAccountByFigmaUserId(id: string): Promise<{
    name: string;
    photoUrl: string;
    figmaUserId: string;
    credits: string;
    hasBonus: boolean;
  }> {
    const account = await this.accountRepository.findOne({
      select: ['name', 'photourl', 'figmauserid', 'credits', 'hasBonus'],
      where: { figmauserid: id },
    });
    return {
      name: account?.name,
      photoUrl: account?.photourl,
      figmaUserId: account?.figmauserid,
      credits: account?.credits,
      hasBonus: account?.hasBonus,
    };
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
      where: { figmauserid: input.figmaUserID },
    });
  }

  //TODO: Remove this method when billing service is updated
  async updateAccountCredits(input: {
    figmaUserID: string;
    credits: string;
  }): Promise<void> {
    const account = await this.findAccountByFigmaUserId(input.figmaUserID);

    if (!account) {
      throw new HttpException(
        `Account ${input.figmaUserID} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    await this.accountRepository.update(
      { figmauserid: input.figmaUserID },
      {
        credits: input.credits,
      },
    );
  }

  async updateAccountBonusCredits(input: {
    figmaUserID: string;
    credits: number;
  }): Promise<void> {
    const account = await this.findAccountByFigmaUserId(input.figmaUserID);

    if (!account) {
      throw new HttpException(
        `Account ${input.figmaUserID} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    if (account.hasBonus) {
      throw new ForbiddenException('Account already has a bonus');
    }

    const currentCredits = parseInt(account.credits);

    const credits = (currentCredits + input.credits).toString();

    await this.accountRepository.update(
      { figmauserid: input.figmaUserID },
      {
        credits,
        hasBonus: true,
      },
    );
  }

  async updateAccountCreditsNew(input: {
    figmaUserID: string;
    credits: number;
  }): Promise<void> {
    const account = await this.findAccountByFigmaUserId(input.figmaUserID);

    if (!account) {
      throw new HttpException(
        `Account ${input.figmaUserID} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    const currentCredits = parseInt(account.credits);

    const credits = (currentCredits + input.credits).toString();

    await this.accountRepository.update(
      { figmauserid: input.figmaUserID },
      {
        credits,
      },
    );
  }
  async checkAccountCredits(figmaID: string, type: string = IMAGE_ENTITY_TYPE) {
    const accountEntity = await this.getAccountCredits({
      figmaUserID: figmaID,
    });

    if (!accountEntity) {
      throw new ForbiddenException('Forbidden');
    }

    const credits = parseInt(accountEntity.credits);
    const IMAGE_CREDITS_COST = this.configService.get('IMAGE_CREDITS_COST');
    const FAVICON_ARCHIVE_CREDITS_COST = this.configService.get(
      'FAVICON_ARCHIVE_CREDITS_COST',
    );
    const BACKGROUND_REMOVAL_CREDITS_COST = this.configService.get(
      'BACKGROUND_REMOVAL_COST',
    );

    const totalCost = {
      [IMAGE_ENTITY_TYPE]: IMAGE_CREDITS_COST,
      [FAVICON_ENTITY_TYPE]: FAVICON_ARCHIVE_CREDITS_COST,
      [BACKGROUND_REMOVAL_ENTITY_TYPE]: BACKGROUND_REMOVAL_CREDITS_COST,
    };

    const ENTITY_CREDITS_COST = totalCost[type];

    if (credits < ENTITY_CREDITS_COST) {
      throw new HttpException(
        "It looks like you don't have enough credits to complete this operation.",
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
  }
}
