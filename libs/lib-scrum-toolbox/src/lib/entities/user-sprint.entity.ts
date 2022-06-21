import { User } from './user.entity';
import { Entity, Column, ManyToOne, PrimaryGeneratedColumn, JoinColumn } from 'typeorm';
import { Sprint } from './sprint.entity';
import { UserModel } from '../models/user.model';

@Entity()
export class UserSprint {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @ManyToOne(() => User, (user) => user.id, { nullable: false })
  @JoinColumn({ name: 'userId' })
  user: UserModel;

  @ManyToOne(() => Sprint, (sprint) => sprint.id, { nullable: false })
  @JoinColumn({ name: 'sprintId' })
  sprint: Sprint;

  @Column({ nullable: false })
  capacity?: number;
}
