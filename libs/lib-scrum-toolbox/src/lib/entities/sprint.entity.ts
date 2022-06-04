import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Project } from './project.entity';
import { SprintStatus } from './sprint-status.entity';

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

  @ManyToOne(() => SprintStatus, (sprintStatus) => sprintStatus.id, { eager: true })
  @JoinColumn({ name: 'statusId' })
  status?: SprintStatus;

  @ManyToOne(() => Project, (project) => project.id, { eager: true })
  @JoinColumn({ name: 'projectId' })
  project?: Project;
}
