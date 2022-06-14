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

    const userRoles = myProfile.roles;
    if (!userRoles) {
      return this.redirection(route);
    }

    const requiredRoles = route.data.roles as Array<any>;
    if (!requiredRoles) {
      return this.redirection(route);
    }

    if (!requiredRoles.every((requiredRole) => userRoles.includes(requiredRole))) {
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
