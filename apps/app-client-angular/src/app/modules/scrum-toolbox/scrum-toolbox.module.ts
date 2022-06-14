import { NgModule, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared.module';
import { ProjectsComponent } from './components/projects/projects.component';
import { NavigationItemModel } from '@libraries/lib-angular';
import { IpcService } from '../../global/services/ipc.service';
import { appRoutes } from '@libraries/lib-scrum-toolbox';
import { WebserviceTestComponent } from './components/webservice-test/webservice-test.component';

@Component({
  template: `
    <app-navigation-container
      [navigationItems]="navigationItems"
      [avatarNavigationItems]="avatarNavigationItems"
      logoImageSource="https://bibliotheque.utbm.fr/wp-content/uploads/2015/04/logo_utbm_seul.png"
      avatarImageSource="https://cdn.pixabay.com/photo/2016/04/01/10/11/avatar-1299805_960_720.png"
      username="Firstname LASTNAME"
    >
      <ng-container navigationBarContent>Navigation bar content </ng-container>

      <router-outlet></router-outlet>
    </app-navigation-container>
  `,
})
export class ScrumToolboxComponent {
  navigationItems: NavigationItemModel[] = [
    new NavigationItemModel({
      label: 'Product backlog',
      iconClass: 'fa-solid fa-clipboard-list',
      routerLink: ['#'],
    }),
    new NavigationItemModel({
      label: 'Sprint backlog',
      iconClass: 'fa-solid fa-list-check',
      routerLink: ['#'],
    }),
    new NavigationItemModel({ label: 'Team', iconClass: 'fa-solid fa-user', routerLink: ['#'] }),
    new NavigationItemModel({ label: 'Metrics', iconClass: 'fa-solid fa-chart-line', routerLink: ['#'] }),

    new NavigationItemModel({
      label: 'TEST',
      iconClass: 'fa-solid fa-flask-vial',
      routerLink: [appRoutes.scrumToolbox.test],
    }),
  ];

  avatarNavigationItems: NavigationItemModel[] = [
    new NavigationItemModel({
      label: 'Règlages',
      iconClass: 'fa-solid fa-gear',
      routerLink: ['profile'],
    }),
    new NavigationItemModel({
      label: 'Déconnexion',
      iconClass: 'fa-solid fa-clipboard-list',
      routerLink: ['logout'],
    }),
  ];

  constructor(private readonly _ipcService: IpcService) {}

  testIpc() {
    this._ipcService.query('test');
  }
}

@NgModule({
  declarations: [ScrumToolboxComponent, ProjectsComponent, WebserviceTestComponent],
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
            path: appRoutes.scrumToolbox.test,
            component: WebserviceTestComponent,
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
