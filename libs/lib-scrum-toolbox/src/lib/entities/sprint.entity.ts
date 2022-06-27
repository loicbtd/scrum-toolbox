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

  @Column({ type: 'date' })
  start_date?: string;

  @Column({ type: 'date' })
  end_date?: string;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  @ManyToOne(() => SprintStatusEntity, (sprintStatus) => sprintStatus.id, { eager: true, nullable: false })
  @JoinColumn({ name: 'statusId' })
  status?: SprintStatusEntity;

  @ManyToOne(() => ProjectEntity, (project) => project.id, { eager: true, nullable: false })
  @JoinColumn({ name: 'projectId' })
  project?: ProjectEntity;

  @OneToMany(() => TaskEntity, (task) => task.sprint)
  tasks?: TaskEntity[];
}
