import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoinService } from './coin.service';
import { CoinController } from './coin.controller';
import { CoinEntity } from '~/coin/entities/coin.entity';
import { AccountEntity } from '~/account/entities/account.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CoinEntity])],
  controllers: [CoinController],
  providers: [CoinService],
})
export class CoinModule {}
