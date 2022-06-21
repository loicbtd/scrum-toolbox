import { Injectable } from '@angular/core';
import { Action, State, StateContext } from '@ngxs/store';
import { BaseCurrentProjectModel } from './base-current-project.model';
import { RefreshProject } from './current-project.actions';

@State<BaseCurrentProjectModel>({
  name: 'CurrentProjectState',
})
@Injectable()
export class CurrentProjectState {
  @Action(RefreshProject)
  refresh(context: StateContext<BaseCurrentProjectModel>, action: RefreshProject) {
    context.setState(action.currentProject);
  }
}
