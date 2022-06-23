import { Action, State, StateContext } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { UpdateProjects } from './projects-updated.actions';

@State<string>({
  name: 'ProjectsUpdatedState',
})
@Injectable()
export class ProjectsUpdatedState {
  @Action(UpdateProjects)
  refresh(context: StateContext<string>, action: UpdateProjects) {
    context.setState(action.action + ' ' + action.label);
  }
}
