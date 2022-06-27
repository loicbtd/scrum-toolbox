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
import { SprintEntity } from './sprint.entity';
import { ProjectEntity } from './project.entity';
import { TaskStatusEntity } from './task-status.entity';
import { TaskTypeEntity } from './task-type.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'task' })
export class TaskEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column()
  label?: string;

  @Column()
  description?: string;

  @Column({ default: 5 })
  capacity?: number;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  @ManyToOne(() => TaskStatusEntity, (taskStatus) => taskStatus.id, {
    eager: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'statusId' })
  status?: TaskStatusEntity;

  @ManyToOne(() => TaskTypeEntity, (taskType) => taskType.id, { eager: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'typeId' })
  type?: TaskTypeEntity;

  @ManyToOne(() => ProjectEntity, (project) => project.id, { eager: true, nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'projectId' })
  project?: ProjectEntity;

  @ManyToMany(() => UserEntity, (user) => user.tasks, { eager: true, onDelete: 'CASCADE' })
  @JoinTable()
  users?: UserEntity[];

  @ManyToOne(() => SprintEntity, (sprint) => sprint.tasks, { eager: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'sprintId' })
  sprint?: SprintEntity;
}
