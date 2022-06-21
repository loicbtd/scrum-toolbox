import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Sprint } from './sprint.entity';
import { Project } from './project.entity';
import { TaskStatus } from './task-status.entity';
import { TaskType } from './task-type.entity';
import { User } from './user.entity';
import { UserModel } from '../models/user.model';

@Entity()
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column()
  label?: string;

  @Column()
  description?: string;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  @ManyToOne(() => TaskStatus, (taskStatus) => taskStatus.id, { eager: true, nullable: false })
  @JoinColumn({ name: 'statusId' })
  status!: TaskStatus;

  @ManyToOne(() => TaskType, (taskType) => taskType.id, { eager: true, nullable: false })
  @JoinColumn({ name: 'typeId' })
  type!: TaskType;

  @ManyToOne(() => Project, (project) => project.id, { eager: true, nullable: false })
  @JoinColumn({ name: 'projectId' })
  project!: Project;

  @ManyToMany(() => User, (user) => user.tasks, { eager: true })
  @JoinTable()
  users?: UserModel[];

  @ManyToOne(() => Sprint, (sprint) => sprint.id, { nullable: true, eager: true })
  @JoinColumn({ name: 'sprintId' })
  sprint?: Sprint;
}
