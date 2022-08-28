import {
  Entity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
  Index
} from 'typeorm';

import { User } from './user.entity';

@Entity()
export class TodoItem {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  userId!: number;

  @Column({ length: 512 })
  title!: string;

  @Column({ type: 'datetime', nullable: true })
  @Index()
  completedAt!: Date | null;

  @CreateDateColumn()
  createdAt!: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user?: User;
}
