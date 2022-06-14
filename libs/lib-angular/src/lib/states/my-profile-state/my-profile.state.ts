import { Action, State, StateContext } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { Refresh } from './my-profile.actions';
import { BaseMyProfileModel } from './base-my-profile.model';

@State<BaseMyProfileModel>({
  name: 'MyProfileState',
})
@Injectable()
export class MyProfileState {
  @Action(Refresh)
  refresh(context: StateContext<BaseMyProfileModel>, action: Refresh) {
    context.setState(action.myProfile);
  }
}
