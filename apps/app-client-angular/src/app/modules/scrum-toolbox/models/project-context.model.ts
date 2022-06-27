import { ProjectEntity, ProjectMemberEntity, SprintEntity, SprintMemberEntity } from '@libraries/lib-scrum-toolbox';

export class ProjectContextModel {
  availableProjects: ProjectEntity[];
  project?: ProjectEntity;
  projectMembers: ProjectMemberEntity[];

  availableSprints: SprintEntity[];
  sprint?: SprintEntity;
  sprintMembers: SprintMemberEntity[];
}
