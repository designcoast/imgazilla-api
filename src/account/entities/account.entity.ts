import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Exclude } from 'class-transformer';

@Entity('Account')
export class AccountEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @IsString()
  @Column({ nullable: true })
  name: string;

  @IsString()
  @Column({ nullable: true })
  photoUrl: string;

  @IsNotEmpty()
  @IsString()
  @Column({ name: 'figma_user_id', type: 'varchar', nullable: false })
  @PrimaryColumn()
  figmaUserID: string;

  @IsNotEmpty()
  @IsNumber()
  @Column({ name: 'credits', type: 'varchar', default: '30' })
  credits: string;

  @Exclude()
  @IsDateString()
  @CreateDateColumn({ select: false })
  createAt: Date;

  @Exclude()
  @IsDateString()
  @UpdateDateColumn({ select: false })
  updateAt: Date;
}
