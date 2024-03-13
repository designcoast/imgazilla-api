import {
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { AccountEntity } from '~/account/entities/account.entity';
import { IsDateString, IsNotEmpty, IsNumber } from 'class-validator';

// Update this line of code to use just env variables
const DEFAULT_COINS_NUMBER = process.env.DEFAULT_COINS_NUMBER || 30;

@Entity()
export class AccountCoinEntity {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @OneToOne(() => AccountEntity, (account) => account.coin)
  account: AccountEntity;

  @IsNotEmpty()
  @IsNumber()
  @Column({ default: DEFAULT_COINS_NUMBER })
  count: number;

  @IsDateString()
  @CreateDateColumn()
  createAt: Date;

  @IsDateString()
  @UpdateDateColumn()
  updateAt: Date;
}
