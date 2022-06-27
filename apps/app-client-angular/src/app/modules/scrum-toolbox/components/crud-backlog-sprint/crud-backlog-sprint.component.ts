import { Component } from '@angular/core';
import { CurrentProjectState, ToastMessageService } from '@libraries/lib-angular';
import {
  appIpcs,
  ProjectEntity,
  SprintEntity,
  TaskEntity,
  TaskStatusEntity,
  TaskTypeEntity,
  UserEntity,
  ProjectMemberEntity,
} from '@libraries/lib-scrum-toolbox';
import { IpcService } from '../../../../global/services/ipc.service';
import { ConfirmationService } from 'primeng/api';
import { Select } from '@ngxs/store';
import { CurrentProjectModel } from '../../../../global/models/current-project.model';
import { Observable, Subscription } from 'rxjs';

@Component({
  templateUrl: './crud-backlog-sprint.component.html',
  styleUrls: ['./crud-backlog-sprint.component.scss'],
})
export class CrudBacklogSprintComponent {
  @Select(CurrentProjectState) currentProject$: Observable<CurrentProjectModel>;

  dialogUpdate: boolean;

  dialogNew: boolean;

  sprints: SprintEntity[];

  selectedSprint: SprintEntity;

  items: TaskEntity[];

  item: TaskEntity;

  selectedItems: TaskEntity[];

  submitted: boolean;

  taskStatus: TaskStatusEntity[];
  selectedStatus: TaskStatusEntity;

  taskType: TaskTypeEntity[];
  selectedType: TaskTypeEntity;

  selectedAllUsersForTask: UserEntity[];
  selectedUsers: UserEntity[];
  filteredUsers: UserEntity[];

  selectedProject: ProjectEntity;

  selectedTasks: TaskEntity[];
  filteredTasks: TaskEntity[];

  sub: Subscription;

  capa: number | undefined;

  get isCreationMode() {
    return !this.item.id;
  }

  constructor(
    private readonly _toastMessageService: ToastMessageService,
    private readonly _confirmationService: ConfirmationService,
    private readonly _ipcService: IpcService
  ) {}

  async ngOnInit(sprint: SprintEntity | undefined) {
    this.taskStatus = await this._ipcService.query<TaskStatusEntity[]>(appIpcs.retrieveAllTasksStatus);
    this.selectedStatus = this.taskStatus[0];

    this.taskType = await this._ipcService.query<TaskTypeEntity[]>(appIpcs.retrieveAllTasksType);
    this.selectedType = this.taskType[0];

    this.sub = this.currentProject$.subscribe(async (data: CurrentProjectModel) => {
      if (data) {
        this.selectedProject = data.project;

        this.sprints = await this._ipcService.query<SprintEntity[]>(appIpcs.retrieveAllSprintsByProject, {
          id: this.selectedProject.id,
        });

        if (sprint) {
          this.selectedSprint = sprint;
        } else {
          this.selectedSprint = this.sprints[0];
        }

        this.updateTasks(this.selectedSprint);
      }
    });
  }

  openNew() {
    this.initDialogFieldsNew();
    const tempStatus = this.item?.status as TaskStatusEntity;
    const tempType = this.item?.type as TaskTypeEntity;
    this.capa = 5;
    this.item = { status: tempStatus, type: tempType, capacity: this.capa };
    this.submitted = false;
    this.dialogNew = true;
  }

  deleteSelectedItems() {
    this._confirmationService.confirm({
      message: 'Are you sure you want to delete from the sprint the selected items?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        for (const item of this.selectedItems) {
          try {
            await this._ipcService.query(appIpcs.unassignTaskToSprint, item.id);
          } catch (error) {
            this._toastMessageService.showError('Error while deleting item');
          }
        }
        this.selectedItems = [];

        this._toastMessageService.showSuccess('Items Deleted', 'Successful');
        this.refresh();
      },
    });
  }

  initDialogFieldsUpdate(item: TaskEntity) {
    this.selectedUsers = [];
    this.selectedStatus = item.status;
    this.selectedType = item.type;
    this.capa = item.capacity;
    this.filterUsers(item);
  }

  editItem(item: TaskEntity) {
    this.initDialogFieldsUpdate(item);
    this.item = { ...item };
    this.dialogUpdate = true;
  }

  initDialogFieldsNew() {
    this.selectedTasks = [];
    this.filterTasks();
  }

  async deleteItem(task: TaskEntity) {
    this._confirmationService.confirm({
      message: 'Are you sure you want to remove this task from the sprint?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        try {
          await this._ipcService.query(appIpcs.unassignTaskToSprint, task.id);

          const tempStatus = this.item.status as TaskStatusEntity;
          const tempType = this.item.type as TaskTypeEntity;
          this.item = { status: tempStatus, type: tempType };
          this._toastMessageService.showSuccess('Item Deleted', 'Successful');

          this.refresh();
        } catch (error) {
          this._toastMessageService.showError(`Error while deleting item`);
        }
      },
    });
  }

  hideDialog() {
    this.dialogUpdate = false;
    this.dialogNew = false;
    this.submitted = false;
  }

  async saveItem() {
    this.submitted = true;

    if (this.item.id) {
      if (this.item.label === '' || this.item.description === '') {
        return;
      }
      try {
        this.item.users = this.selectedUsers;
        this.item.status = this.selectedStatus;
        this.item.type = this.selectedType;
        this.item.capacity = this.capa;

        await this._ipcService.query(appIpcs.updateTask, this.item);

        this._toastMessageService.showSuccess('Item Updated', 'Successful');

        this.refresh();
      } catch (error: any) {
        this._toastMessageService.showError(error.message, `Error while updating item`);
      }
    } else {
      try {
        this.selectedTasks.forEach(async (task) => {
          task.status = this.selectedStatus;
          task.type = this.selectedType;
          task.capacity = this.capa;

          const t = await this._ipcService.query<TaskEntity>(appIpcs.updateTask, task);
          await this._ipcService.query<SprintEntity>(appIpcs.assignTaskToSprint, {
            taskId: t.id,
            sprintId: this.selectedSprint.id,
          });
        });

        this._toastMessageService.showSuccess('Item Created', 'Successful');
        this.resetDialogNew();
        this.hideDialog();

        this.refresh();
      } catch (error: any) {
        this.resetDialogNew();
        this.hideDialog();

        this._toastMessageService.showError(error.message, `Error while creating item`);
      }
    }

    this.items = [...this.items];
    this.dialogUpdate = false;
    const tempStatus = this.item.status as TaskStatusEntity;
    const tempType = this.item.type as TaskTypeEntity;
    this.item = { status: tempStatus, type: tempType };
  }

  refresh() {
    this.sub.unsubscribe();
    this.ngOnInit(this.selectedSprint);
  }

  resetDialogNew() {
    this.selectedTasks = [];
  }

  selectColorStatus(it: any): object {
    return { 'background-color': it.status.backgroundColor, color: it.status.textColor };
  }
  selectColorWithStatus(it: any): object {
    return { 'background-color': it.backgroundColor, color: it.textColor };
  }

  selectColorType(it: any): object {
    return { 'background-color': it.type.backgroundColor, color: it.type.textColor };
  }
  selectColorWithType(it: any): object {
    return { 'background-color': it.backgroundColor, color: it.textColor };
  }

  getInitials(user: UserEntity): string {
    return `${user.firstname?.charAt(0)}${user.lastname?.charAt(0)}}`;
  }

  async updateTasks(sprint: SprintEntity) {
    await this._ipcService.query<TaskEntity[]>(appIpcs.retrieveAllTasksBySprint, this.selectedSprint.id);
    this.item = this.items[0];
  }

  convertUserUserTypeProjectIntoUsers(usersTypeProject: ProjectMemberEntity[]): UserEntity[] {
    const result: UserEntity[] = [];

    usersTypeProject.forEach((el) => {
      if (el.user) {
        result.push(el.user);
      }
    });

    return result;
  }

  async filterUsers(task: TaskEntity) {
    const usersProject: ProjectMemberEntity[] = await this._ipcService.query<ProjectMemberEntity[]>(
      appIpcs.retrieveAllUsersInProject,
      this.selectedProject.id
    );

    if (task.users?.length == 0) {
      this.filteredUsers = this.convertUserUserTypeProjectIntoUsers(usersProject);
      return;
    }

    this.selectedUsers = [...new Set([...this.selectedUsers, ...(task.users || [])])];

    this.filteredUsers = this.convertUserUserTypeProjectIntoUsers(
      usersProject.filter((userFromProject) => {
        return this.selectedUsers.every((filter) => {
          return filter.username !== userFromProject.user?.username && filter.id !== userFromProject.user?.id;
        });
      })
    );
  }

  async filterTasks() {
    const tasksProject = await this._ipcService.query<TaskEntity[]>(
      appIpcs.retrieveAllTasksByProject,
      this.selectedProject.id
    );

    let tasksSprint = await this._ipcService.query<TaskEntity[]>(
      appIpcs.retrieveAllTasksBySprint,
      this.selectedSprint.id
    );

    if (tasksSprint.length == 0) {
      this.filteredTasks = tasksProject;
      return;
    }

    tasksSprint = [...new Set([...tasksSprint, ...this.selectedTasks])];

    this.filteredTasks = tasksProject.filter((tasksFromProject) => {
      return tasksSprint.every((filter) => {
        return filter.label !== tasksFromProject.label && filter.id !== tasksFromProject.id;
      });
    });
  }
}
