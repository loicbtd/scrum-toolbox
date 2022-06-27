import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToMany } from 'typeorm';
import { TaskEntity } from './task.entity';

@Entity({ name: 'user' })
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ unique: true })
  username?: string;

  @Column({ select: false })
  password?: string;

  @Column()
  firstname?: string;

  @Column()
  lastname?: string;

  @CreateDateColumn()
  createdAt?: Date;

  @Column({ default: true })
  isActivated?: boolean;

  @ManyToMany(() => TaskEntity, (task) => task.users, { onDelete: 'SET NULL' })
  tasks?: TaskEntity[];
}
