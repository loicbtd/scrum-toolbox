import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared.module';
import { Component } from '@angular/core';
import { ProjectsComponent } from './components/projects/projects.component';
import { NavigationItemModel } from '@libraries/lib-angular';
import { IpcService } from '../../global/services/ipc.service';
import { appIpcs, appRoutes } from '@libraries/lib-scrum-toolbox';

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
      <p-button label="Test IPC" (click)="testIpc()"></p-button>
      <p-button label="CREATE USER" (click)="createUser()"></p-button>
      <p-button label="UPDATE USER" (click)="updateUser()"></p-button>
      <p-button label="DELETE USER" (click)="deleteUser()"></p-button>
      <p-button label="GET ALL USER" (click)="retrieveAllUsers()"></p-button>
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
  async createUser() {
    const user = await this._ipcService.query(appIpcs.createUser, {
      username: 'titi',
      firstname: 'Toto',
      lastname: 'TITI',
    });
    console.log(user);
  }

  updateUser() {
    this._ipcService.query(appIpcs.updateUser, {
      id: 'b053e43d-ca55-4ede-b16d-ad4b2d0ed971',
      username: 'titi',
      firstname: 'Tartenpion',
      lastname: 'TITI',
    });
  }
  deleteUser() {
    this._ipcService.query(appIpcs.deleteUser, {
      id: 'b053e43d-ca55-4ede-b16d-ad4b2d0ed971',
    });
  }

  async retrieveAllUsers() {
    const users = await this._ipcService.query(appIpcs.retrieveAllUsers);
    console.log(users);
  }
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
