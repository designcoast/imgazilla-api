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

@Entity()
export class CoinEntity {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @OneToOne(() => AccountEntity, (account) => account.figmaUserID, {
    cascade: true,
  })
  @JoinColumn({ name: 'figmaUserID' })
  account: AccountEntity;

  @Column()
  count: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
