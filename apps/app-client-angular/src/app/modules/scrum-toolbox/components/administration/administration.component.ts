import { Component } from '@angular/core';
import { appRoutes } from '@libraries/lib-scrum-toolbox';
import { MenuItem } from 'primeng/api';

@Component({
  template: `
    <p-tabMenu [model]="items"></p-tabMenu>
    <router-outlet></router-outlet>
  `,
})
export class AdministrationComponent {
  items: MenuItem[] = [
    { label: 'Users', icon: 'fa-solid fa-user', routerLink: [appRoutes.scrumToolbox.administration.crudUsers] },
    {
      label: 'Projects',
      icon: 'fa-solid fa-briefcase',
      routerLink: [appRoutes.scrumToolbox.administration.crudProjects],
    },
    {
      label: 'Create sprint',
      icon: 'fa-solid fa-forward',
      routerLink: [appRoutes.scrumToolbox.administration.createSprint],
    },
  ];
}
