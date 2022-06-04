import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, ManyToMany, JoinTable } from 'typeorm';
import { Sprint } from './sprint.entity';
import { Project } from './project.entity';
import { TaskStatus } from './task-status.entity';
import { TaskType } from './task-type.entity';
import { User } from './user.entity';

@Entity()
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column()
  label?: string;

  @Column()
  description?: string;

  @ManyToOne(() => TaskStatus, (taskStatus) => taskStatus.id, { eager: true })
  @JoinColumn({ name: 'statusId' })
  status?: TaskStatus;

  @ManyToOne(() => TaskType, (taskType) => taskType.id, { eager: true })
  @JoinColumn({ name: 'typeId' })
  type?: TaskType;

  @ManyToOne(() => Project, (project) => project.id, { eager: true })
  @JoinColumn({ name: 'projectId' })
  project?: Project;

  @ManyToMany(() => User, (user) => user.tasks, { eager: true })
  @JoinTable()
  users?: User[];

  @ManyToOne(() => Sprint, (sprint) => sprint.id, { nullable: true, eager: true })
  @JoinColumn({ name: 'sprintId' })
  sprint?: Sprint;
}
