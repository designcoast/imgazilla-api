import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class AccountEntity {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  firstName: string;

  @PrimaryColumn()
  figmaUserID: string;

  @CreateDateColumn()
  createdAt: Date;
}
