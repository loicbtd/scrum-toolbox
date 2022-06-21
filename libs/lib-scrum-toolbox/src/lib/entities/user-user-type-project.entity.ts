import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserModel } from '../models/user.model';
import { Project } from './project.entity';
import { UserType } from './user-type.entity';
import { User } from './user.entity';

@Entity()
export class UserUserTypeProject {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @ManyToOne(() => User, (user) => user.id, { eager: true, nullable: false })
  @JoinColumn({ name: 'userId' })
  user?: UserModel;

  @ManyToOne(() => UserType, (userType) => userType.id, { eager: true, nullable: false })
  @JoinColumn({ name: 'userTypeId' })
  userType?: string;

  @ManyToOne(() => Project, (project) => project.id, { eager: true, nullable: false })
  @JoinColumn({ name: 'projectId' })
  project?: Project;
}
