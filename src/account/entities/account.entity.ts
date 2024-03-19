import {
  Column,
  CreateDateColumn,
  Entity,
  ObjectIdColumn,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

import { IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { DEFAULT_COINS_NUMBER } from '~/constants';
import { Exclude } from 'class-transformer';

@Entity('Account')
export class AccountEntity {
  @Exclude()
  @ObjectIdColumn({ select: false })
  id: string;

  @IsString()
  @Column({ nullable: true })
  name: string;

  @IsString()
  @Column({ nullable: true })
  photoUrl: string;

  @IsNotEmpty()
  @IsString()
  @Column({ name: 'figma_user_id', type: 'string', nullable: false })
  @PrimaryColumn()
  figmaUserID: string;

  @IsNotEmpty()
  @IsNumber()
  @Column({ name: 'coins_count', type: 'string', default: '30' })
  coinsCount: string = DEFAULT_COINS_NUMBER;

  @Exclude()
  @IsDateString()
  @CreateDateColumn({ select: false })
  createAt: Date;

  @Exclude()
  @IsDateString()
  @UpdateDateColumn({ select: false })
  updateAt: Date;
}
