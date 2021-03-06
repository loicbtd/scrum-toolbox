import { ProjectEntity, ProjectMemberEntity, SprintEntity, SprintMemberEntity } from '@libraries/lib-scrum-toolbox';

export class RefreshSelectedProject {
  static readonly type = '[Project Context] Refresh selected project';
  constructor(public project?: ProjectEntity) {}
}

export class RefreshAvailableProjects {
  static readonly type = '[Project Context] Refresh available projects';
  constructor(public projects: ProjectEntity[]) {}
}

export class RefreshSelectedSprint {
  static readonly type = '[Project Context] Refresh selected sprint';
  constructor(public sprint?: SprintEntity) {}
}

export class RefreshAvailableSprints {
  static readonly type = '[Project Context] Refresh available sprints';
  constructor(public sprints: SprintEntity[]) {}
}

export class RefreshSelectedProjectMembers {
  static readonly type = '[Project Context] Refresh selected project members';
  constructor(public projectMembers: ProjectMemberEntity[]) {}
}

export class RefreshSelectedSprintMembers {
  static readonly type = '[Project Context] Refresh selected sprint members';
  constructor(public sprintMembers: SprintMemberEntity[]) {}
}
