import { Injectable } from '@angular/core';
import { appIpcs, ProjectEntity, SprintEntity } from '@libraries/lib-scrum-toolbox';
import { Store } from '@ngxs/store';
import { IpcService } from '../../../global/services/ipc.service';
import {
  RefreshAvailableProjects,
  RefreshAvailableSprints,
  RefreshSelectedProject,
  RefreshSelectedSprint,
} from '../store/actions/project-context.actions';

@Injectable({
  providedIn: 'root',
})
export class ProjectContextService {
  constructor(private readonly _store: Store, private readonly _ipcService: IpcService) {}

  async refreshAvailableProjects() {
    const projects = await this._ipcService.query<ProjectEntity[]>(appIpcs.retrieveAllProjects);

    this._store.dispatch(new RefreshAvailableProjects(projects));

    if (projects.length > 0) {
      await this.refreshSelectedProject(projects[0]);
    }
  }

  async refreshSelectedProject(project: ProjectEntity): Promise<void> {
    if (!project) {
      return;
    }

    this._store.dispatch(new RefreshSelectedProject(project));

    const availableSprints = await this._ipcService.query<SprintEntity[]>(
      appIpcs.retrieveAllSprintsByProject,
      project.id
    );

    availableSprints.sort((sprint1, sprint2) => {
      if (!sprint1.end_date || !sprint2.end_date) {
        return 0;
      }

      return (
        Math.abs(Date.now().valueOf() - sprint1.end_date.valueOf()) -
        Math.abs(Date.now().valueOf() - sprint2.end_date.valueOf())
      );
    });

    this._store.dispatch(new RefreshAvailableSprints(availableSprints));

    if (availableSprints.length > 0) {
      this._store.dispatch(new RefreshSelectedSprint(availableSprints[0]));
    }
  }
}
