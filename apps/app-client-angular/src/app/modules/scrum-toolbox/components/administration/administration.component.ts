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
    { label: 'Users', icon: 'fa-solid fa-user', routerLink: [appRoutes.scrumToolbox.administration.users] },
    {
      label: 'Projects',
      icon: 'fa-solid fa-briefcase',
      routerLink: [appRoutes.scrumToolbox.administration.projects],
    },
    {
      label: 'Task Status',
      icon: 'fa-solid fa-clipboard-check',
      routerLink: [appRoutes.scrumToolbox.administration.taskStatus],
    },
    {
      label: 'Task Type',
      icon: 'fa-solid fa-clipboard-question',
      routerLink: [appRoutes.scrumToolbox.administration.taskType],
    },
    {
      label: 'Sprint Status',
      icon: 'fa-solid fa-arrow-rotate-right',
      routerLink: [appRoutes.scrumToolbox.administration.sprintStatus],
    },
    {
      label: 'Démonstration',
      icon: 'fa-solid fa-code',
      routerLink: [appRoutes.scrumToolbox.administration.development],
    },
  ];
}
