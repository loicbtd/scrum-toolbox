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
import { ProjectEntity } from './project.entity';
import { SprintStatusEntity } from './sprint-status.entity';
import { TaskEntity } from './task.entity';

@Entity({ name: 'sprint' })
export class SprintEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column()
  label?: string;

  @Column({ type: 'datetime' })
  startDate?: Date;

  @Column({ type: 'datetime' })
  endDate?: Date;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  @ManyToOne(() => SprintStatusEntity, (sprintStatus) => sprintStatus.id, { eager: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'statusId' })
  status?: SprintStatusEntity;

  @ManyToOne(() => ProjectEntity, (project) => project.id, { eager: true, nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'projectId' })
  project?: ProjectEntity;

  @OneToMany(() => TaskEntity, (task) => task.sprint)
  tasks?: TaskEntity[];
}
