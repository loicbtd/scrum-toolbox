import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToMany } from 'typeorm';
import { Task } from './task.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ unique: true })
  username?: string;

  @Column()
  firstname?: string;

  @Column()
  lastname?: string;

  @CreateDateColumn()
  createdAt?: Date;

  @ManyToMany(() => Task, (task) => task.users, { eager: true })
  tasks?: Task[];
}
