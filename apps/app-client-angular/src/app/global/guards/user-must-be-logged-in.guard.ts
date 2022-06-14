import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { MyProfileState } from '@libraries/lib-angular';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserMustBeLoggedInGuard implements CanActivate {
  constructor(private readonly store: Store, private readonly router: Router) {}

  canActivate(
    _route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (!this.store.selectSnapshot<string>(MyProfileState)) {
      return this.router.createUrlTree([
        appRoutes.errors,
        errorsRoutes.accessDenied,
      ]);
    }

    return true;
  }
}


export class UserMustBeLoggedInGuard {
  static redirect(roles: string[]) {
    return new InjectionToken<CanActivate>('AccessGuardWithRoles', {
      providedIn: 'root',
      factory: () => {
        const authorizationService = inject(AuthorizationService);

        return {
          canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): <boolean | UrlTree > | Promise<boolean | UrlTree> | boolean | UrlTree {
              return authorizationService.hasRole(roles);
          }
        };
      },
    });
  }
}