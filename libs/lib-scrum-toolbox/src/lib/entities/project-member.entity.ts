import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ProjectRoleEnumeration } from '../enumerations/project-role.enumeration';
import { ProjectEntity } from './project.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'project_member' })
export class ProjectMemberEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @ManyToOne(() => UserEntity, (user) => user.id, { eager: true, nullable: false })
  @JoinColumn({ name: 'userId' })
  user?: UserEntity;

  @Column({ type: 'simple-enum', enum: ProjectRoleEnumeration })
  role?: ProjectRoleEnumeration;

  @ManyToOne(() => ProjectEntity, (project) => project.id, { eager: true, nullable: false })
  @JoinColumn({ name: 'project_id' })
  project?: ProjectEntity;
}
