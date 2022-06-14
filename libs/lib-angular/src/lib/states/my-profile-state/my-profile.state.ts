import { Action, State, StateContext } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { Refresh } from './my-profile.actions';
import { MyProfileModel } from './my-profile.model';

@State<string>({
  name: 'MyProfileState',
})
@Injectable()
export class MyProfileState {
  @Action(Refresh)
  refresh(context: StateContext<MyProfileModel>, action: Refresh) {
    context.setState(action.profile);
  }
}
