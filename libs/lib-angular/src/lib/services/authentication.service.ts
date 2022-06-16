import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { lastValueFrom } from 'rxjs';
import { Login, Logout, Refresh } from '../states/my-profile-state/my-profile.actions';
import { BaseMyProfileModel } from '../states/my-profile-state/base-my-profile.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(private readonly _store: Store, private readonly _router: Router) {}

  async refreshMyProfile<T extends BaseMyProfileModel>(myProfile: T): Promise<void> {
    await lastValueFrom(this._store.dispatch(new Refresh(myProfile)));
  }

  async login<T extends BaseMyProfileModel>(myProfile: T, redirectionPath = ['']): Promise<void> {
    await lastValueFrom(this._store.dispatch(new Refresh(myProfile)));
    await this._router.navigate(redirectionPath);
  }

  async logout(redirectionPath = ['']): Promise<void> {
    await lastValueFrom(this._store.dispatch(new Refresh({ isLoggedIn: false })));
    await this._router.navigate(redirectionPath);
  }
}
