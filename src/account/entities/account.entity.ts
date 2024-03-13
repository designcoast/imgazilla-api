import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ObjectIdColumn,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AccountCoinEntity } from '~/account/entities/accountCoins.entity';
import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

@Entity('Account')
export class AccountEntity {
  @ObjectIdColumn()
  id: number;

  @IsString()
  @Column({ nullable: true })
  name: string;

  @IsNotEmpty()
  @IsString()
  @Column({ nullable: false })
  @PrimaryColumn()
  figmaUserID: string;

  @OneToOne(() => AccountCoinEntity, (coin) => coin.account)
  @JoinColumn()
  coin: AccountCoinEntity;

  @IsDateString()
  @CreateDateColumn()
  createAt: Date;

  @IsDateString()
  @UpdateDateColumn()
  updateAt: Date;
}
