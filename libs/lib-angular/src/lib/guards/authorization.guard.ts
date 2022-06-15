import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { BaseMyProfileModel } from '../states/my-profile-state/base-my-profile.model';
import { MyProfileState } from '../states/my-profile-state/my-profile.state';

@Injectable({
  providedIn: 'root',
})
export class AuthorizationGuard implements CanActivate {
  constructor(private readonly store: Store, private readonly router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const myProfile = this.store.selectSnapshot<BaseMyProfileModel>(MyProfileState);
    if (!myProfile) {
      return this.redirection(route);
    }

    if (!myProfile.isLoggedIn) {
      return this.redirection(route);
    }

    const userRights = myProfile.rights;
    if (!userRights) {
      return this.redirection(route);
    }

    const requiredRights = route.data.rights as Array<any>;
    if (!requiredRights) {
      return this.redirection(route);
    }

    if (!requiredRights.every((requiredRight) => userRights.includes(requiredRight))) {
      return this.redirection(route);
    }

    return true;
  }

  redirection(route: ActivatedRouteSnapshot) {
    const notLoggedInRedirectionPath = route.data.notLoggedInRedirectionPath as Array<string>;
    if (notLoggedInRedirectionPath) {
      return this.router.createUrlTree(notLoggedInRedirectionPath);
    } else {
      return this.router.createUrlTree(['']);
    }
  }
}
