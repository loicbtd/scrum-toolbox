import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared.module';
import { Component } from '@angular/core';
import { AllComponent } from './components/all/all.component';
import { appRoutes } from '@libraries/lib-common';

@Component({
  template: `<router-outlet></router-outlet>`,
})
export class BacklogComponent {}

@NgModule({
  declarations: [BacklogComponent, AllComponent],
  providers: [BacklogModule],
  imports: [
    SharedModule,
    RouterModule.forChild([
      {
        path: '',
        component: BacklogComponent,
        children: [
          {
            path: appRoutes.backlog.all,
            component: AllComponent,
          },
          {
            path: '**',
            redirectTo: appRoutes.backlog.all,
          },
        ],
      },
    ]),
  ],
})
export class BacklogModule {}
