import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { errorsRoutes } from '../../modules/errors/constants/errors-routes.constant';
import { appRoutes } from '../constants/app-route.constant';
import { JwtState } from '../store/state/jwt.state';

@Injectable({
  providedIn: 'root',
})
export class NotSignedInStateIsRequiredGuard implements CanActivate {
  constructor(private readonly store: Store, private readonly router: Router) {}

  canActivate(
    _route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (this.store.selectSnapshot<string>(JwtState)) {
      return this.router.createUrlTree([
        appRoutes.errors,
        errorsRoutes.accessDenied,
      ]);
    }

    return true;
  }
}
