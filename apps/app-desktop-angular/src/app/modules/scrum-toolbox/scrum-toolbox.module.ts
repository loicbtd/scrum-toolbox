import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared.module';
import { Component } from '@angular/core';
import { appRoutes } from '@libraries/lib-common';
import { ProjectsComponent } from './components/projects/projects.component';
import { MenuItem } from '@libraries/lib-angular';

@Component({
  template: `<app-navigation [leftNavigationItems]="menuItems"><router-outlet></router-outlet></app-navigation>`,
})
export class ScrumToolboxComponent {
  menuItems: MenuItem[] = [
    { label: 'Product backlog', iconClass: 'fa-solid fa-clipboard-list', routerLink: '#' },
    { label: 'Sprint backlog', iconClass: 'fa-solid fa-list-check', routerLink: '#' },
    { label: 'Team', iconClass: 'fa-solid fa-user', routerLink: '#' },
    { label: 'Sprint backlog', iconClass: 'fa-solid fa-chart-line', routerLink: '#' },
  ];
}

@NgModule({
  declarations: [ScrumToolboxComponent, ProjectsComponent],
  providers: [ScrumToolboxModule],
  imports: [
    SharedModule,
    RouterModule.forChild([
      {
        path: '',
        component: ScrumToolboxComponent,
        children: [
          {
            path: appRoutes.scrumToolbox.mainMenu,
            component: ProjectsComponent,
          },
          {
            path: appRoutes.scrumToolbox.all,
            component: ProjectsComponent,
          },
          {
            path: '**',
            redirectTo: appRoutes.scrumToolbox.all,
          },
        ],
      },
    ]),
  ],
})
export class ScrumToolboxModule {}
