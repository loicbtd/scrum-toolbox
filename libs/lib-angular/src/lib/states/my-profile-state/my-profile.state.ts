import { Action, State, StateContext } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { Login, Logout, Refresh } from './my-profile.actions';
import { BaseMyProfileModel } from './base-my-profile.model';

@State<BaseMyProfileModel>({
  name: 'MyProfileState',
  defaults: { rights: [], isLoggedIn: false },
})
@Injectable()
export class MyProfileState {
  @Action(Refresh)
  refresh(context: StateContext<BaseMyProfileModel>, action: Refresh) {
    context.setState(action.myProfile);
  }

  @Action(Login)
  login(context: StateContext<BaseMyProfileModel>) {
    context.setState({ ...context.getState(), isLoggedIn: true });
  }

  @Action(Logout)
  logout(context: StateContext<BaseMyProfileModel>) {
    context.setState({ ...context.getState(), isLoggedIn: false });
  }
}
