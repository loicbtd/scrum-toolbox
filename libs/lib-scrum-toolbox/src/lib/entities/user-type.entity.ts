import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { UserUserTypeProject } from './user-user-type-project.entity';

@Entity()
export class UserType {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column()
  label?: string;

  @OneToMany(() => UserUserTypeProject, (userUserTypeProject) => userUserTypeProject.userType)
  userUserTypeProjects: UserUserTypeProject[];
}
