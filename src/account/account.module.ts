import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountEntity } from './entities/account.entity';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { AccountCoinEntity } from '~/account/entities/accountCoins.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AccountEntity, AccountCoinEntity])],
  controllers: [AccountController],
  providers: [AccountService],
})
export class AccountModule {}
