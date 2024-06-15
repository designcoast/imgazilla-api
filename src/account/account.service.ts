import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccountEntity } from '~/account/entities/account.entity';
import { Repository } from 'typeorm';
import { DEFAULT_CREDITS_NUMBER } from '~/constants';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(AccountEntity)
    private readonly accountRepository: Repository<AccountEntity>,
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

  async updateAccountCredits(input: { figmaUserID: string; credits: string }) {
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
}
