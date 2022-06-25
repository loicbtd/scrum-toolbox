import { Component, OnInit } from '@angular/core';
import { CurrentProjectState, ToastMessageService } from '@libraries/lib-angular';
import { Select } from '@ngxs/store';
import { CurrentProjectModel } from '../../../../global/models/current-project.model';
import { Observable } from 'rxjs';
import {
  appIpcs,
  SprintEntity,
  TaskEntity,
  UserEntity,
  UserModel,
  ProjectEntity,
  ProjectMemberEntity,
  ProjectRoleEnumeration,
} from '@libraries/lib-scrum-toolbox';
import { IpcService } from '../../../../global/services/ipc.service';

@Component({
  templateUrl: './project-team.component.html',
  styles: [
    `
      .user-type {
        color: blue;
        font-weight: normal !important;
      }
      .p-invalid {
        color: red !important;
      }
      th {
        white-space: nowrap;
      }
    `,
  ],
})
export class ProjectTeamComponent implements OnInit {
  @Select(CurrentProjectState) currentProject$: Observable<CurrentProjectModel>;

  projectSelected!: ProjectEntity;

  dialog = false;

  selectedItem: ProjectMemberEntity;

  userSprints!: SprintEntity[];

  sprintsMapping: { [k: string]: string } = { '<2': 'Sprint', other: 'Sprints' };

  projectMembers!: ProjectMemberEntity[];

  usersTasks!: TaskEntity[];

  dialogNew = false;

  newSubmitted = false;

  usersAvailables!: UserModel[];

  newUser!: UserModel;

  projectRoles!: ProjectRoleEnumeration[];

  newUserPosition!: ProjectRoleEnumeration;

  constructor(private readonly _ipcService: IpcService, private readonly _toastMessageService: ToastMessageService) {}

  async ngOnInit(): Promise<void> {
    this.currentProject$.subscribe(async (data: CurrentProjectModel) => {
      this.projectSelected = data.project;
      await this.updateUsers();
    });
  }

  async updateUsers() {
    this.projectMembers = await this._ipcService.query<ProjectMemberEntity[]>(
      appIpcs.retrieveAllUsersInProject,
      this.projectSelected.id
    );
  }

  async showDetails(item: ProjectMemberEntity) {
    this.selectedItem = item;
    this.dialog = true;
    this.userSprints = await this._ipcService.query<SprintEntity[]>(appIpcs.retrieveAllSprintsOfUser, {
      userId: item.user?.id,
      projectId: item.project?.id,
    });
  }

  hideDialog() {
    this.userSprints = [];
    this.selectedItem = {};
    this.dialog = false;
  }

  async displayTaskForSprint(index: number) {
    const t = await this._ipcService.query<TaskEntity[]>(appIpcs.retrieveAllTasksBySprint, this.userSprints[index].id);
    this.usersTasks = t.filter((_) => this.selectedItem.user && _.users?.includes(this.selectedItem.user));
  }

  selectColorStatus(it: TaskEntity): object {
    return { 'background-color': it.status.backgroundColor, color: it.status.textColor };
  }

  selectColorType(it: TaskEntity): object {
    return { 'background-color': it.type.backgroundColor, color: it.type.textColor };
  }

  getInitials(user: UserEntity): string {
    return '' + user.firstname?.charAt(0) + '' + user.lastname?.charAt(0);
  }
}
