import { Component } from '@angular/core';
import { ToastMessageService } from '@libraries/lib-angular';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import {
  appIpcs,
  SprintEntity,
  TaskEntity,
  UserEntity,
  UserModel,
  ProjectMemberEntity,
  ProjectRoleEnumeration,
} from '@libraries/lib-scrum-toolbox';
import { IpcService } from '../../../../global/services/ipc.service';
import { ProjectContextState } from '../../store/states/project-context.state';
import { ProjectContextModel } from '../../models/project-context.model';

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
export class ProjectTeamComponent {
  @Select(ProjectContextState) projectContext$: Observable<ProjectContextModel>;

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

  selectColorStatus(task: TaskEntity): object {
    return { 'background-color': task.status?.backgroundColor, color: task.status?.textColor };
  }

  selectColorType(task: TaskEntity): object {
    return { 'background-color': task.type?.backgroundColor, color: task.type?.textColor };
  }

  getInitials(user: UserEntity): string {
    return `${user.firstname?.charAt(0)}${user.lastname?.charAt(0)}`;
  }
}
