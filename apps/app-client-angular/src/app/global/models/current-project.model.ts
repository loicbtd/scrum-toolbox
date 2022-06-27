import { BaseCurrentProjectModel } from '@libraries/lib-angular';
import { ProjectEntity } from '@libraries/lib-scrum-toolbox';

export class CurrentProjectModel extends BaseCurrentProjectModel {
  project: ProjectEntity;
}
