import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { lastValueFrom } from 'rxjs';
import { RefreshProject } from '../states/current-project-state/current-project.actions';
import { BaseCurrentProjectModel } from '../states/current-project-state/base-current-project.model';

@Injectable({
  providedIn: 'root',
})
export class CurrentProjectService {
  constructor(private readonly _store: Store) {}

  async refreshProject<T extends BaseCurrentProjectModel>(currentProject: T): Promise<void> {
    await lastValueFrom(this._store.dispatch(new RefreshProject(currentProject)));
  }
}
