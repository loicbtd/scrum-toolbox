import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Store } from '@ngxs/store';
import { Remember } from './visited-routes.actions';

@Injectable({ providedIn: 'root' })
export class VisitedRoutesService {
  constructor(router: Router, store: Store) {
    store.dispatch(new Remember(router.url));

    router.events.subscribe((event) => {
      console.log('router changes');

      if (event instanceof NavigationEnd) {
        store.dispatch(new Remember(event.url));
      }
    });
  }
}
