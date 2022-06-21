import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Project } from './project.entity';
import { SprintStatus } from './sprint-status.entity';
import { Task } from './task.entity';

@Entity()
export class Sprint {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column()
  label?: string;

  @Column({ type: 'date' })
  start_date?: string;

  @Column({ type: 'date' })
  end_date?: string;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  @ManyToOne(() => SprintStatus, (sprintStatus) => sprintStatus.id, { eager: true, nullable: false })
  @JoinColumn({ name: 'statusId' })
  status?: SprintStatus;

  @ManyToOne(() => Project, (project) => project.id, { eager: true, nullable: false })
  @JoinColumn({ name: 'projectId' })
  project?: Project;

  @OneToMany(() => Task, (task) => task.sprint)
  tasks?: Task[];
}
