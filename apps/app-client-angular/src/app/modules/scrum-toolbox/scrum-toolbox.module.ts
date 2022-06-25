import { NgModule, Component, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared.module';
import {
  AuthenticationService,
  CurrentProjectState,
  MyProfileState,
  NavigationItemInterface,
  CurrentProjectService,
  ProjectsUpdatedState,
} from '@libraries/lib-angular';
import { appIpcs, appRoutes, ProjectEntity } from '@libraries/lib-scrum-toolbox';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { MyProfileModel } from '../../global/models/my-profile.model';
import { CrudUsersComponent } from './components/crud-users/crud-users.component';
import { AdministrationComponent } from './components/administration/administration.component';
import { CrudProjectsComponent } from './components/crud-projects/crud-projects.component';
import { CrudBacklogSprintComponent } from './components/crud-backlog-sprint/crud-backlog-sprint.component';
import { IpcService } from '../../global/services/ipc.service';
import { CurrentProjectModel } from '../../global/models/current-project.model';
import { Dropdown } from 'primeng/dropdown';
import { CrudTaskStatusComponent } from './components/crud-task-status/crud-task-status.component';
import { CrudSprintStatusComponent } from './components/crud-sprint-status/crud-sprint-status.component';
import { CrudTaskTypeComponent } from './components/crud-task-type/crud-task-type.component';
import { ProjectTeamComponent } from './components/project-team/project-team.component';
import { CrudBacklogProductComponent } from './components/crud-backlog-product/crud-backlog-product.component';
import { DevelopmentComponent } from './components/development/development.component';
import { MetricsComponent } from './components/project-metrics/project-metrics.component';

@Component({
  template: `
    <app-navigation-container
      [navigationItems]="navigationItems"
      [avatarNavigationItems]="avatarNavigationItems"
      logoImageSource="assets/images/icon.png"
      avatarImageSource="assets/images/avatar.png"
      [username]="getFormattedUsername((myProfile$ | async)?.user?.firstname, (myProfile$ | async)?.user?.lastname)"
    >
      <div navigationBarContent class="flex align-content-center align-items-center">
        <h2 class="mr-2">Current project :</h2>
        <p-dropdown
          #dropDownProject
          (onChange)="updateProject($event.value)"
          [options]="projects"
          optionLabel="label"
          optionValue="id"
          placeholder="Select a project"
        >
        </p-dropdown>
      </div>
      <router-outlet></router-outlet>
    </app-navigation-container>
  `,
})
export class ScrumToolboxComponent {
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

  @Select(CurrentProjectState) currentProject$: Observable<CurrentProjectModel>;

  projects!: ProjectEntity[];

  @Select(ProjectsUpdatedState) projectsUdpated$: Observable<string>;

  @ViewChild('dropDownProject') dropDownProject: Dropdown;

  getFormattedUsername(firstname?: string, lastname?: string): string {
    const formattedFirstname = firstname ? firstname.charAt(0).toUpperCase() + firstname.slice(1) : '';

    let formattedLastname = lastname ? lastname.toUpperCase() : '';

    if (formattedLastname.length > 15) {
      formattedLastname = `${formattedLastname.charAt(0)}.`;
    }

    return `${formattedFirstname} ${formattedLastname}`;
  }

  async updateProject(projectId: string) {
    const selected = this.projects.find((p: ProjectEntity) => p.id == projectId);
    if (selected) {
      await this._currentProjectService.refreshProject<CurrentProjectModel>({
        project: selected,
      });
    }
  }

  constructor(
    private readonly _authenticationService: AuthenticationService,
    private readonly _ipcService: IpcService,
    private readonly _currentProjectService: CurrentProjectService
  ) {}

  private async updateAllProjects() {
    this.projects = await this._ipcService.query<ProjectEntity[]>(appIpcs.retrieveAllProjects);
  }

  async ngOnInit(): Promise<void> {
    await this.updateAllProjects();
    this.projectsUdpated$.subscribe(async () => {
      await this.updateAllProjects();
    });

    this.currentProject$.subscribe((data: CurrentProjectModel) => {
      if (data.project) {
        this.dropDownProject.value = data.project.id;
      }
    });
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
