import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { BaseMyProfileModel } from '../states/my-profile-state/base-my-profile.model';
import { MyProfileState } from '../states/my-profile-state/my-profile.state';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationGuard implements CanActivate {
  constructor(private readonly store: Store, private readonly router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const myProfile = this.store.selectSnapshot<BaseMyProfileModel>(MyProfileState);

    if (!myProfile) {
      const notLoggedInRedirectionPath = route.data.notLoggedInRedirectionPath as Array<string>;
      if (notLoggedInRedirectionPath) {
        return this.router.createUrlTree(notLoggedInRedirectionPath);
      } else {
        return this.router.createUrlTree(['']);
      }
    }

    return true;
  }
}
