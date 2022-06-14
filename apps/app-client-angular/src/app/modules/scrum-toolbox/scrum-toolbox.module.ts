import { NgModule, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared.module';
import { ProjectsComponent } from './components/projects/projects.component';
import { MyProfileState, NavigationItemInterface } from '@libraries/lib-angular';
import { appRoutes } from '@libraries/lib-scrum-toolbox';
import { WebserviceTestComponent } from './components/webservice-test/webservice-test.component';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { MyProfileModel } from '../../global/models/my-profile.model';
import { UsersCrudComponent } from './components/users-crud/users-crud.component';

@Component({
  template: `
    <app-navigation-container
      [navigationItems]="navigationItems"
      [avatarNavigationItems]="avatarNavigationItems"
      logoImageSource="assets/images/icon.png"
      avatarImageSource="assets/images/avatar.png"
      [username]="getFormattedUsername((myProfile$ | async)?.firstname, (myProfile$ | async)?.lastname)"
    >
      <router-outlet></router-outlet>
    </app-navigation-container>
  `,
})
export class ScrumToolboxComponent {
  navigationItems: NavigationItemInterface[] = [
    {
      label: 'Product backlog',
      iconClass: 'fa-solid fa-clipboard-list',
      routerLink: ['#'],
    },
    {
      label: 'Sprint backlog',
      iconClass: 'fa-solid fa-list-check',
      routerLink: ['#'],
    },
    { label: 'Team', iconClass: 'fa-solid fa-user', routerLink: ['#'] },
    { label: 'Metrics', iconClass: 'fa-solid fa-chart-line', routerLink: ['#'] },
    {
      label: 'TEST',
      iconClass: 'fa-solid fa-flask-vial',
      routerLink: [appRoutes.scrumToolbox.test],
    },
  ];

  avatarNavigationItems: NavigationItemInterface[] = [
    {
      label: 'Règlages',
      iconClass: 'fa-solid fa-gear',
      routerLink: ['profile'],
    },
    {
      label: 'Déconnexion',
      iconClass: 'fa-solid fa-clipboard-list',
      routerLink: ['logout'],
    },
  ];

  @Select(MyProfileState) myProfile$: Observable<MyProfileModel>;

  getFormattedUsername(firstname?: string, lastname?: string): string {
    const formattedFirstname = firstname ? firstname.charAt(0).toUpperCase() + firstname.slice(1) : '';

    let formattedLastname = lastname ? lastname.toUpperCase() : '';

    if (formattedLastname.length > 15) {
      formattedLastname = `${formattedLastname.charAt(0)}.`;
    }

    return `${formattedFirstname} ${formattedLastname}`;
  }
}

@NgModule({
  declarations: [ScrumToolboxComponent, ProjectsComponent, WebserviceTestComponent, UsersCrudComponent],
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
            path: appRoutes.scrumToolbox.usersCrud,
            component: UsersCrudComponent,
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
