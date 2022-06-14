import { Action, State, StateContext } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { Remember } from './visited-routes.actions';

@State<string[]>({
  name: 'VisitedRoutesState',
  defaults: [],
})
@Injectable()
export class VisitedRoutesState {
  @Action(Remember)
  remember(context: StateContext<string[]>, action: Remember) {
    if (context.getState().length > 9) {
      context.setState([...context.getState().slice(-9), action.url]);
    } else {
      context.setState([...context.getState(), action.url]);
    }
  }
}
