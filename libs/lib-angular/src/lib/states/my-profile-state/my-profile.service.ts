import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { lastValueFrom } from 'rxjs';
import { Login, Logout, Refresh } from './my-profile.actions';
import { BaseMyProfileModel } from './base-my-profile.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class MyProfileService {
  constructor(private readonly _store: Store, private readonly _router: Router) {}

  async refresh<T extends BaseMyProfileModel>(myProfile: T): Promise<void> {
    await lastValueFrom(this._store.dispatch(new Refresh(myProfile)));
  }

  async login(redirectionPath = ['']): Promise<void> {
    await lastValueFrom(this._store.dispatch(new Login()));
    this._router.navigate(redirectionPath);
  }

  async logout(redirectionPath = ['']): Promise<void> {
    await lastValueFrom(this._store.dispatch(new Logout()));
    this._router.navigate(redirectionPath);
  }
}
