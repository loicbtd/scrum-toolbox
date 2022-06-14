import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Project } from './project.entity';
import { Sprint } from './sprint.entity';
import { UserType } from './user-type.entity';
import { User } from './user.entity';

@Entity()
export class UserUserTypeProject {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @ManyToOne(() => User, (user) => user.id, { eager: true, nullable: false })
  @JoinColumn({ name: 'userId' })
  user?: Sprint;

  @ManyToOne(() => UserType, (userType) => userType.id, { eager: true, nullable: false })
  @JoinColumn({ name: 'userTypeId' })
  userType?: Sprint;

  @ManyToOne(() => Project, (project) => project.id, { eager: true, nullable: false })
  @JoinColumn({ name: 'projectId' })
  project?: Sprint;
}
