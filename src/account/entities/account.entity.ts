import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CoinEntity } from '~/coin/entities/coin.entity';

@Entity()
export class AccountEntity {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  firstName: string;

  @PrimaryColumn()
  figmaUserID: string;

  // @OneToOne(() => CoinEntity, (coin) => coin.count)
  // @JoinColumn()
  // coin: number;

  @CreateDateColumn()
  createdAt: Date;
}
