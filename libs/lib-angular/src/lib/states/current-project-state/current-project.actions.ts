import { BaseCurrentProjectModel } from './base-current-project.model';

export class RefreshProject {
  static readonly type = '[Current Project] Refresh';
  constructor(public currentProject: BaseCurrentProjectModel) {}
}
