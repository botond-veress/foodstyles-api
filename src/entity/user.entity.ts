import { Entity, PrimaryGeneratedColumn, Column, Index, CreateDateColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 64 })
  @Index({ unique: true })
  email!: string;

  @Column({ length: 64, select: false })
  hashedPassword!: string;

  @Column({ length: 64 })
  name!: string;

  @CreateDateColumn()
  createdAt!: Date;
}
