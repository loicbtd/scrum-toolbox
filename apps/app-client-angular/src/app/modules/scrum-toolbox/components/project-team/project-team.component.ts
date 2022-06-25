import { Component, OnInit } from '@angular/core';
import { CurrentProjectState, ToastMessageService } from '@libraries/lib-angular';
import { Select } from '@ngxs/store';
import { CurrentProjectModel } from '../../../../global/models/current-project.model';
import { Observable } from 'rxjs';
import {
  appIpcs,
  Sprint,
  UserUserTypeProject,
  Task,
  User,
  Project,
  UserModel,
  UserType,
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
    `,
  ],
})
export class ProjectTeamComponent implements OnInit {
  @Select(CurrentProjectState) currentProject$: Observable<CurrentProjectModel>;
  projectSelected!: Project;
  dialog = false;

  selectedItem: UserUserTypeProject;

  userSprints!: Sprint[];

  sprintsMapping: { [k: string]: string } = { '<2': 'Sprint', other: 'Sprints' };

  userUserTypeProject!: UserUserTypeProject[];

  usersTasks!: Task[];

  dialogNew = false;

  newSubmitted = false;

  usersAvailables!: UserModel[];

  newUser!: UserModel;

  usersPositions!: UserType[];

  newUserPosition!: UserType;

  constructor(private readonly _ipcService: IpcService, private readonly _toastMessageService: ToastMessageService) {}

  async ngOnInit(): Promise<void> {
    this.currentProject$.subscribe(async (data: CurrentProjectModel) => {
      this.projectSelected = data.project;
      await this.updateUsers();
    });
  }

  async updateUsers() {
    this.userUserTypeProject = await this._ipcService.query<UserUserTypeProject[]>(
      appIpcs.retrieveAllUsersInProject,
      this.projectSelected.id
    );
  }

  async showDetails(item: UserUserTypeProject) {
    this.selectedItem = item;
    this.dialog = true;
    this.userSprints = await this._ipcService.query<Sprint[]>(appIpcs.retrieveAllSprintsOfUser, {
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
    const t = await this._ipcService.query<Task[]>(appIpcs.retrieveAllTasksBySprint, this.userSprints[index].id);
    this.usersTasks = t.filter((_) => this.selectedItem.user && _.users?.includes(this.selectedItem.user));
  }

  selectColorStatus(it: Task): object {
    return { 'background-color': it.status.backgroundColor, color: it.status.textColor };
  }

  selectColorType(it: Task): object {
    return { 'background-color': it.type.backgroundColor, color: it.type.textColor };
  }

  getInitials(user: User): string {
    return '' + user.firstname?.charAt(0) + '' + user.lastname?.charAt(0);
  }

  async openNew() {
    this.dialogNew = true;
    this.usersAvailables = await this._ipcService.query(appIpcs.retrieveAllUsersNotInProject, this.projectSelected.id);
    this.usersPositions = await this._ipcService.query(appIpcs.retrieveAllUsersType);
  }

  hideNewDialog() {
    this.newUser = {};
    this.newUserPosition = new UserType();
    this.dialogNew = false;
    this.newSubmitted = false;
  }

  async saveNewItem() {
    this.newSubmitted = true;
    if (this.newUser && this.newUserPosition) {
      const uutp = new UserUserTypeProject();
      uutp.project = this.projectSelected;
      uutp.user = this.newUser;
      uutp.userType = this.newUserPosition;
      await this._ipcService.query(appIpcs.assignUserToProject, uutp);
      await this.updateUsers();
      this._toastMessageService.showSuccess('Item Created', 'Successful');
      this.hideNewDialog();
    }
  }
}
