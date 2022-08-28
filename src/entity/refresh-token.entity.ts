import { Entity, Column, PrimaryColumn, CreateDateColumn, DeleteDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import crypto from 'crypto';

import { User } from './user.entity';

@Entity()
export class RefreshToken {
  @PrimaryColumn({ type: 'varchar', length: 128 })
  id!: string;

  @Column()
  userId!: number;

  @Column({ nullable: true })
  expireAt?: Date;

  @CreateDateColumn()
  createdAt!: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user?: User;

  static createId() {
    return crypto.randomBytes(64).toString('base64');
  }
}
