import { ProjectEntity, ProjectMemberEntity, SprintEntity, TaskEntity } from '@libraries/lib-scrum-toolbox';

export class ProjectContextModel {
  availableProjects: ProjectEntity[];
  project?: ProjectEntity;

  availableSprints: SprintEntity[];
  sprint?: SprintEntity;

  members: ProjectMemberEntity[];
}
