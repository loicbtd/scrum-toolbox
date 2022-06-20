import { NgModule, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared.module';
import { ProjectsComponent } from './components/projects/projects.component';
import {
  AuthenticationService,
  CurrentProjectState,
  MyProfileState,
  NavigationItemInterface,
  CurrentProjectService,
} from '@libraries/lib-angular';
import { appIpcs, appRoutes, Project } from '@libraries/lib-scrum-toolbox';
import { WebserviceTestComponent } from './components/webservice-test/webservice-test.component';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { MyProfileModel } from '../../global/models/my-profile.model';
import { CrudUsersComponent } from './components/crud-users/crud-users.component';
import { AdministrationComponent } from './components/administration/administration.component';
import { CrudProjectsComponent } from './components/crud-projects/crud-projects.component';
import { IpcService } from '../../global/services/ipc.service';
import { CurrentProjectModel } from '../../global/models/current-project.model';

@Component({
  template: `
    <app-navigation-container
      [navigationItems]="navigationItems"
      [avatarNavigationItems]="avatarNavigationItems"
      logoImageSource="assets/images/icon.png"
      avatarImageSource="assets/images/avatar.png"
      [username]="getFormattedUsername((myProfile$ | async)?.user?.firstname, (myProfile$ | async)?.user?.lastname)"
    >
      <div
        navigationBarContent
        class="flex align-content-center align-items-center"
        *ngIf="selectedProject !== undefined"
      >
        <h2>Project :</h2>
        <p-dropdown
          class="ml-5"
          (onChange)="updateProject($event.value)"
          [(ngModel)]="selectedProject"
          [options]="projects"
          optionLabel="label"
        >
          <ng-template pTemplate="selectedItem">
            <div class="country-item country-item-value" *ngIf="selectedProject">
              <div>{{ selectedProject.label }}</div>
            </div>
          </ng-template>
        </p-dropdown>
      </div>
      <router-outlet></router-outlet>
    </app-navigation-container>
  `,
})
export class ScrumToolboxComponent {
  selectedProject?: Project = undefined;
  projects!: Project[];
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
      label: 'Administration',
      iconClass: 'fa-solid fa-gear',
      routerLink: [appRoutes.scrumToolbox.administration.root],
    },
    {
      label: 'Déconnexion',
      iconClass: 'fa-solid fa-clipboard-list',
      separatorAbove: true,
      action: async () => await this._authenticationService.logout([appRoutes.login]),
    },
  ];

  @Select(MyProfileState) myProfile$: Observable<MyProfileModel>;

  @Select(CurrentProjectState) currentProject$: Observable<CurrentProjectModel>;

  getFormattedUsername(firstname?: string, lastname?: string): string {
    const formattedFirstname = firstname ? firstname.charAt(0).toUpperCase() + firstname.slice(1) : '';

    let formattedLastname = lastname ? lastname.toUpperCase() : '';

    if (formattedLastname.length > 15) {
      formattedLastname = `${formattedLastname.charAt(0)}.`;
    }

    return `${formattedFirstname} ${formattedLastname}`;
  }

  async updateProject(project: Project) {
    this.selectedProject = project;
    await this._currentProjectService.refreshProject<CurrentProjectModel>({
      project: project,
    });
  }

  constructor(
    private readonly _authenticationService: AuthenticationService,
    private readonly _ipcService: IpcService,
    private readonly _currentProjectService: CurrentProjectService
  ) {}

  async ngOnInit(): Promise<void> {
    this.projects = await this._ipcService.query<Project[]>(appIpcs.retrieveAllProjects);
    this.currentProject$.subscribe((data: CurrentProjectModel) => {
      this.selectedProject = data.project;
    });
    this.selectedProject = this.projects[0];
  }
}

@NgModule({
  declarations: [
    ScrumToolboxComponent,
    ProjectsComponent,
    WebserviceTestComponent,
    CrudUsersComponent,
    CrudProjectsComponent,
    AdministrationComponent,
  ],
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
            path: appRoutes.scrumToolbox.administration.root,
            component: AdministrationComponent,
            children: [
              {
                component: CrudUsersComponent,
                path: appRoutes.scrumToolbox.administration.crudUsers,
              },
              {
                component: CrudProjectsComponent,
                path: appRoutes.scrumToolbox.administration.crudProjects,
              },
              {
                path: '**',
                redirectTo: appRoutes.scrumToolbox.administration.crudUsers,
              },
            ],
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
