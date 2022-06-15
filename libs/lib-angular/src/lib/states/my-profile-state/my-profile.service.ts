import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { lastValueFrom } from 'rxjs';
import { Login, Logout, Refresh } from './my-profile.actions';
import { BaseMyProfileModel } from './base-my-profile.model';

@Injectable({
  providedIn: 'root',
})
export class MyProfileService {
  constructor(private readonly store: Store) {}

  async refresh<T extends BaseMyProfileModel>(myProfile: T): Promise<void> {
    await lastValueFrom(this.store.dispatch(new Refresh(myProfile)));
  }

  async login(): Promise<void> {
    await lastValueFrom(this.store.dispatch(new Login()));
  }

  async logout(): Promise<void> {
    await lastValueFrom(this.store.dispatch(new Logout()));
  }
}
