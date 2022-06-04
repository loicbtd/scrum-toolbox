import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinColumn } from 'typeorm';
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

  @ManyToOne(() => SprintStatus, (sprintStatus) => sprintStatus.id, { eager: true })
  @JoinColumn({ name: 'statusId' })
  status?: SprintStatus;

  // @OneToMany(() => UserSprint, (userSprint) => userSprint.sprint)
  // userSprints: UserSprint[];

  @ManyToMany(() => Task, (task) => task.sprint)
  tasks?: Task[];

  @ManyToOne(() => Project, (project) => project.id, { eager: true })
  @JoinColumn({ name: 'projectId' })
  project?: Project;
}
