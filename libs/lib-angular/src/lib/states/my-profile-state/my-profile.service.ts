import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { lastValueFrom } from 'rxjs';
import { Refresh } from './my-profile.actions';
import { BaseMyProfileModel } from './base-my-profile.model';

@Injectable({
  providedIn: 'root',
})
export class MyProfileService {
  constructor(private readonly store: Store) {}

  async refresh(myProfile: BaseMyProfileModel): Promise<void> {
    await lastValueFrom(this.store.dispatch(new Refresh(myProfile)));
  }
}
