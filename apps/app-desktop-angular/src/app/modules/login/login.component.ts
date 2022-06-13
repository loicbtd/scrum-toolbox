import { Component } from '@angular/core';
import { appRoutes } from '@libraries/lib-common';

@Component({
  templateUrl: './login.component.html',
  styleUrls: [ './login.component.scss' ]
})
export class LoginComponent {
    routes = appRoutes;
    // constructor() {}
}