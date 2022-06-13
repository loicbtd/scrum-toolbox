import 'reflect-metadata';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToMany } from 'typeorm';
import { Task } from './task.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ unique: true })
  username?: string;

  @Column()
  password?: string;

  @Column()
  firstname?: string;

  @Column()
  lastname?: string;

  @CreateDateColumn()
  createdAt?: Date;

  @Column({ default: true })
  isActivated?: boolean;

  @ManyToMany(() => Task, (task) => task.users)
  tasks?: Task[];
}
