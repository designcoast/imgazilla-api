import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { Exclude } from 'class-transformer';

@Entity('account')
export class AccountEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @IsString()
  @Column({ nullable: true })
  name: string;

  @IsString()
  @Column({ nullable: true })
  photourl: string;

  @IsNotEmpty()
  @IsString()
  @Column({ name: 'figmauserid', type: 'varchar', nullable: false })
  @PrimaryColumn()
  figmauserid: string;

  @IsNotEmpty()
  @IsNumber()
  @Column({ name: 'credits', type: 'varchar', default: '30' })
  credits: string;

  @IsNotEmpty()
  @IsBoolean()
  @Column({ name: 'has_bonus', type: 'boolean', default: false })
  hasBonus: boolean;

  @Exclude()
  @IsDateString()
  @CreateDateColumn({ select: false })
  createat: Date;

  @Exclude()
  @IsDateString()
  @UpdateDateColumn({ select: false })
  updateat: Date;
}
