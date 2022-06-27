import { UserEntity } from './user.entity';
import { Entity, Column, ManyToOne, PrimaryGeneratedColumn, JoinColumn } from 'typeorm';
import { SprintEntity } from './sprint.entity';
import { UserModel } from '../models/user.model';

@Entity({ name: 'sprint_member' })
export class SprintMemberEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @ManyToOne(() => UserEntity, (user) => user.id, { nullable: false })
  @JoinColumn({ name: 'userId' })
  user?: UserModel;

  @ManyToOne(() => SprintEntity, (sprint) => sprint.id, { nullable: false })
  @JoinColumn({ name: 'sprintId' })
  sprint?: SprintEntity;

  @Column({ nullable: false })
  capacity?: number;
}
