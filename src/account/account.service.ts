import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccountEntity } from '~/account/entities/account.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(AccountEntity)
    private readonly accountRepository: Repository<AccountEntity>,
  ) {}

  async findAccountByFigmaUserId(id: string): Promise<AccountEntity> {
    return await this.accountRepository.findOneBy({ figmaUserID: id });
  }

  async createAccount(input: {
    figmaUserID: string;
    name: string;
  }): Promise<AccountEntity> {
    return await this.accountRepository.save(input);
  }
}
