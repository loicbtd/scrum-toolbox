import { User } from './user.entity';
import { Entity, Column, ManyToOne, PrimaryGeneratedColumn, JoinColumn } from 'typeorm';
import { Sprint } from './sprint.entity';

@Entity()
export class UserSprint {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Sprint, (sprint) => sprint.id)
  @JoinColumn({ name: 'sprintId' })
  sprint: Sprint;

  @Column()
  capacity?: number;
}
