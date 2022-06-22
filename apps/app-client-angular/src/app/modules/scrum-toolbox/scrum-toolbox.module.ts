import { NgModule, Component, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared.module';
import { ProjectsComponent } from './components/projects/projects.component';
import {
  AuthenticationService,
  CurrentProjectState,
  MyProfileState,
  NavigationItemInterface,
  CurrentProjectService,
  ProjectsService,
} from '@libraries/lib-angular';
import { appIpcs, appRoutes, Project } from '@libraries/lib-scrum-toolbox';
import { WebserviceTestComponent } from './components/webservice-test/webservice-test.component';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { MyProfileModel } from '../../global/models/my-profile.model';
import { CrudUsersComponent } from './components/crud-users/crud-users.component';
import { AdministrationComponent } from './components/administration/administration.component';
import { CrudProjectsComponent } from './components/crud-projects/crud-projects.component';
import { CrudProjectAttendeesComponent } from './components/crud-project-attendees/crud-project-attendees.component';
import { CrudBacklogSprintComponent } from './components/crud-backlog-sprint/crud-backlog-sprint.component';
import { IpcService } from '../../global/services/ipc.service';
import { CurrentProjectModel } from '../../global/models/current-project.model';
import { Dropdown } from 'primeng/dropdown';
import { CrudTaskStatusComponent } from './components/crud-task-status/crud-task-status.component';
import { CrudSprintStatusComponent } from './components/crud-sprint-status/crud-sprint-status.component';
import { CrudTaskTypeComponent } from './components/crud-task-type/crud-task-type.component';

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
        <h2>Project :</h2>
        <p-dropdown
          #dropDownProject
          class="ml-5"
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
      routerLink: ['#'],
    },
    {
      label: 'Sprint backlog',
      iconClass: 'fa-solid fa-list-check',
      routerLink: [appRoutes.scrumToolbox.sprintBacklog],
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

  projects!: Project[];

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
    const selected = this.projects.find((p: Project) => p.id == projectId);
    if (selected) {
      await this._currentProjectService.refreshProject<CurrentProjectModel>({
        project: selected,
      });
    }
  }

  constructor(
    private readonly _authenticationService: AuthenticationService,
    private readonly _ipcService: IpcService,
    private readonly _currentProjectService: CurrentProjectService,
    private readonly _projectsService: ProjectsService
  ) {}

  private async updateAllProjects() {
    this.projects = await this._ipcService.query<Project[]>(appIpcs.retrieveAllProjects);
  }

  async ngOnInit(): Promise<void> {
    await this.updateAllProjects();
    this._projectsService.subject$.subscribe(() => {
      this.updateAllProjects();
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
    ProjectsComponent,
    WebserviceTestComponent,
    CrudUsersComponent,
    CrudProjectsComponent,
    AdministrationComponent,
    CrudProjectAttendeesComponent,
    CrudBacklogSprintComponent,
    CrudTaskStatusComponent,
    CrudSprintStatusComponent,
    CrudTaskTypeComponent,
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
            path: appRoutes.scrumToolbox.sprintBacklog,
            component: CrudBacklogSprintComponent,
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
                path: '**',
                redirectTo: appRoutes.scrumToolbox.administration.users,
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
