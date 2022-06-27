import { NgModule, Component, OnInit, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared.module';
import { AuthenticationService, MyProfileState, NavigationItemInterface } from '@libraries/lib-angular';
import { appIpcs, appRoutes, ProjectEntity } from '@libraries/lib-scrum-toolbox';
import { NgxsModule, Select, Store } from '@ngxs/store';
import { lastValueFrom, Observable } from 'rxjs';
import { MyProfileModel } from '../../global/models/my-profile.model';
import { CrudUsersComponent } from './components/crud-users/crud-users.component';
import { AdministrationComponent } from './components/administration/administration.component';
import { CrudProjectsComponent } from './components/crud-projects/crud-projects.component';
import { CrudBacklogSprintComponent } from './components/crud-backlog-sprint/crud-backlog-sprint.component';
import { IpcService } from '../../global/services/ipc.service';
import { CrudTaskStatusComponent } from './components/crud-task-status/crud-task-status.component';
import { CrudSprintStatusComponent } from './components/crud-sprint-status/crud-sprint-status.component';
import { CrudTaskTypeComponent } from './components/crud-task-type/crud-task-type.component';
import { ProjectTeamComponent } from './components/project-team/project-team.component';
import { CrudBacklogProductComponent } from './components/crud-backlog-product/crud-backlog-product.component';
import { DevelopmentComponent } from './components/development/development.component';
import { MetricsComponent } from './components/project-metrics/project-metrics.component';
import { ProjectContextState } from './store/states/project-context.state';
import { RefreshAvailableProjects, RefreshSelectedProject } from './store/actions/project-context.actions';
import { Dropdown } from 'primeng/dropdown';

@Component({
  template: `
    <app-navigation-container
      [navigationItems]="navigationItems"
      [avatarNavigationItems]="avatarNavigationItems"
      logoImageSource="assets/images/icon.png"
      avatarImageSource="assets/images/avatar.png"
      [username]="getFormattedUsername((myProfile$ | async)?.user?.firstname, (myProfile$ | async)?.user?.lastname)"
    >
      <div navigationBarContent class="flex align-content-center align-items-center ml-5">
        <h3 class="mr-2">Current project :</h3>

        <p-dropdown
          #dropdown
          optionLabel="label"
          [options]="(availableProjects$ | async) || []"
          [ngModel]="project$ | async"
          (ngModelChange)="refreshSelectedProject($event)"
          placeholder="Select a project"
        >
        </p-dropdown>
      </div>
      <router-outlet></router-outlet>
    </app-navigation-container>
  `,
})
export class ScrumToolboxComponent implements OnInit {
  navigationItems: NavigationItemInterface[] = [
    {
      label: 'Product backlog',
      iconClass: 'fa-solid fa-clipboard-list',
      routerLink: [appRoutes.scrumToolbox.root],
    },
    {
      label: 'Sprint backlog',
      iconClass: 'fa-solid fa-list-check',
      routerLink: [appRoutes.scrumToolbox.backlogSprint],
    },
    { label: 'Team', iconClass: 'fa-solid fa-user', routerLink: [appRoutes.scrumToolbox.projectTeam] },
    { label: 'Metrics', iconClass: 'fa-solid fa-chart-line', routerLink: [appRoutes.scrumToolbox.metrics] },
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

  @Select(ProjectContextState.availableProjects) availableProjects$: Observable<ProjectEntity[]>;

  @Select(ProjectContextState.project) project$: Observable<ProjectEntity>;

  @ViewChild('dropdown') dropdown: Dropdown;

  constructor(
    private readonly _authenticationService: AuthenticationService,
    private readonly _ipcService: IpcService,
    private readonly _store: Store
  ) {}

  async ngOnInit(): Promise<void> {
    const availableProjects = await this._ipcService.query<ProjectEntity[]>(appIpcs.retrieveAllProjects);

    await lastValueFrom(this._store.dispatch(new RefreshAvailableProjects(availableProjects)));

    if (availableProjects.length > 0) {
      this.dropdown.value = availableProjects[0];
      await lastValueFrom(this._store.dispatch(new RefreshSelectedProject(availableProjects[0])));
    }
  }

  async refreshSelectedProject(project: ProjectEntity) {
    await lastValueFrom(this._store.dispatch(new RefreshSelectedProject(project)));
  }

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
  declarations: [
    ScrumToolboxComponent,
    DevelopmentComponent,
    CrudUsersComponent,
    CrudProjectsComponent,
    AdministrationComponent,
    CrudBacklogSprintComponent,
    CrudTaskStatusComponent,
    CrudSprintStatusComponent,
    CrudTaskTypeComponent,
    ProjectTeamComponent,
    CrudBacklogProductComponent,
    MetricsComponent,
  ],
  providers: [ScrumToolboxModule],
  imports: [
    SharedModule,
    NgxsModule.forFeature([ProjectContextState]),
    RouterModule.forChild([
      {
        path: '',
        component: ScrumToolboxComponent,
        children: [
          {
            path: appRoutes.scrumToolbox.root,
            component: CrudBacklogProductComponent,
          },
          {
            path: appRoutes.scrumToolbox.backlogSprint,
            component: CrudBacklogSprintComponent,
          },
          {
            path: appRoutes.scrumToolbox.projectTeam,
            component: ProjectTeamComponent,
          },
          {
            path: appRoutes.scrumToolbox.metrics,
            component: MetricsComponent,
          },
          {
            path: appRoutes.scrumToolbox.administration.root,
            component: AdministrationComponent,
            children: [
              {
                component: CrudUsersComponent,
                path: appRoutes.scrumToolbox.administration.users,
              },
              {
                component: CrudProjectsComponent,
                path: appRoutes.scrumToolbox.administration.projects,
              },
              {
                component: CrudTaskStatusComponent,
                path: appRoutes.scrumToolbox.administration.taskStatus,
              },
              {
                component: CrudTaskTypeComponent,
                path: appRoutes.scrumToolbox.administration.taskType,
              },
              {
                component: CrudSprintStatusComponent,
                path: appRoutes.scrumToolbox.administration.sprintStatus,
              },
              {
                path: appRoutes.scrumToolbox.administration.development,
                component: DevelopmentComponent,
              },
              {
                path: '**',
                redirectTo: appRoutes.scrumToolbox.administration.users,
              },
            ],
          },
          {
            path: '**',
            redirectTo: appRoutes.scrumToolbox.root,
          },
        ],
      },
    ]),
  ],
})
export class ScrumToolboxModule {}
