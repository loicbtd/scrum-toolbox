import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { ProjectContextModel } from '../../models/project-context.model';
import { RefreshAvailableProjects, RefreshSelectedProject } from '../actions/project-context.actions';

@State<ProjectContextModel>({
  name: 'ProjectContextState',
  defaults: {
    availableProjects: [],
    availableSprints: [],
    members: [],
  },
})
@Injectable()
export class ProjectContextState {
  @Selector()
  static project(state: ProjectContextModel) {
    return state.project;
  }

  @Selector()
  static availableProjects(state: ProjectContextModel) {
    return state.availableProjects;
  }

  @Selector()
  static sprint(state: ProjectContextModel) {
    return state.sprint;
  }

  @Selector()
  static availableSprints(state: ProjectContextModel) {
    return state.availableSprints;
  }

  @Action(RefreshSelectedProject)
  refreshSelectedProject(context: StateContext<ProjectContextModel>, action: RefreshSelectedProject) {
    context.setState({ ...context.getState(), project: action.project });
  }

  @Action(RefreshAvailableProjects)
  refreshAvailableProjects(context: StateContext<ProjectContextModel>, action: RefreshAvailableProjects) {
    context.setState({ ...context.getState(), availableProjects: action.projects });
  }
}
