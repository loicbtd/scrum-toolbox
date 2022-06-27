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

  @ManyToOne(() => TaskStatusEntity, (taskStatus) => taskStatus.id, { eager: true, nullable: true })
  @JoinColumn({ name: 'status_id' })
  status?: TaskStatusEntity;

  @ManyToOne(() => TaskTypeEntity, (taskType) => taskType.id, { eager: true, nullable: false })
  @JoinColumn({ name: 'type_id' })
  type?: TaskTypeEntity;

  @ManyToOne(() => ProjectEntity, (project) => project.id, { eager: true, nullable: false })
  @JoinColumn({ name: 'project_id' })
  project?: ProjectEntity;

  @ManyToMany(() => UserEntity, (user) => user.tasks, { eager: true })
  @JoinTable()
  users?: UserEntity[];

  @ManyToOne(() => SprintEntity, (sprint) => sprint.tasks, { nullable: true, eager: true })
  @JoinColumn({ name: 'sprint_id' })
  sprint?: SprintEntity;
}
