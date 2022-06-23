import { Component } from '@angular/core';
import { CurrentProjectState, ToastMessageService } from '@libraries/lib-angular';
import {
  appIpcs,
  Project,
  Sprint,
  Task,
  TaskStatus,
  TaskType,
  User,
  UserUserTypeProject,
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

  sprints: Sprint[];

  selectedSprint: Sprint;

  items: Task[];

  item: Task;

  selectedItems: Task[];

  submitted: boolean;

  taskStatus: TaskStatus[];
  selectedStatus: TaskStatus;

  taskType: TaskType[];
  selectedType: TaskType;

  selectedAllUsersForTask: User[];
  selectedUsers: User[];
  filteredUsers: User[];

  selectedProject: Project;

  selectedTasks: Task[];
  filteredTasks: Task[];

  sub: Subscription;

  get isCreationMode() {
    return !this.item.id;
  }

  constructor(
    private readonly _toastMessageService: ToastMessageService,
    private readonly _confirmationService: ConfirmationService,
    private readonly _ipcService: IpcService
  ) {}

  async ngOnInit(sprint: Sprint | undefined) {
    this.taskStatus = await this._ipcService.query<TaskStatus[]>(appIpcs.retrieveAllTasksStatus);
    this.selectedStatus = this.taskStatus[0];

    this.taskType = await this._ipcService.query<TaskType[]>(appIpcs.retrieveAllTasksType);
    this.selectedType = this.taskType[0];

    this.sub = this.currentProject$.subscribe(async (data: CurrentProjectModel) => {
      if (data) {
        this.selectedProject = data.project;

        this.sprints = await this._ipcService.query<Sprint[]>(appIpcs.retrieveAllSprintsByProject, {
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
    const tempStatus = this.item.status as TaskStatus;
    const tempType = this.item.type as TaskType;
    this.item = { status: tempStatus, type: tempType };
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
            item.sprint = undefined;
            await this._ipcService.query(appIpcs.deleteTask, item.id);
          } catch (error) {
            this._toastMessageService.showError('Error while deleting item');
          }
        }
        this.selectedItems = [];

        this._toastMessageService.showSuccess('Items Deleted', 'Successful');
      },
    });
  }

  initDialogFieldsUpdate(item: Task) {
    this.selectedUsers = [];
    this.selectedStatus = item.status;
    this.selectedType = item.type;
    this.filterUsers(item);
  }

  editItem(item: Task) {
    this.initDialogFieldsUpdate(item);
    this.item = { ...item };
    this.dialogUpdate = true;
  }

  initDialogFieldsNew() {
    this.selectedTasks = [];
    this.filterTasks();
  }

  async deleteItem(task: Task) {
    console.log(task);

    this._confirmationService.confirm({
      message: 'Are you sure you want to remove this task from the sprint?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        try {
          await this._ipcService.query(appIpcs.unassignTaskToSprint, task.id);

          const tempStatus = this.item.status as TaskStatus;
          const tempType = this.item.type as TaskType;
          this.item = { status: tempStatus, type: tempType };
          this._toastMessageService.showSuccess('Item Deleted', 'Successful');

          this.sub.unsubscribe();
          this.ngOnInit(this.selectedSprint);
        } catch (error) {
          console.log(error);

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
      try {
        this.item.users = this.selectedUsers;
        this.item.status = this.selectedStatus;
        this.item.type = this.selectedType;

        console.log(this.item);

        await this._ipcService.query(appIpcs.updateTask, this.item);

        this._toastMessageService.showSuccess('Item Updated', 'Successful');
        this.sub.unsubscribe();
        this.ngOnInit(this.selectedSprint);
      } catch (error: any) {
        this._toastMessageService.showError(error.message, `Error while updating item`);
      }
    } else {
      try {
        this.selectedTasks.forEach(async (task) => {
          task.status = this.selectedStatus;
          task.type = this.selectedType;

          const t = await this._ipcService.query<Task>(appIpcs.updateTask, task);
          await this._ipcService.query<Sprint>(appIpcs.assignTaskToSprint, {
            taskId: t.id,
            sprintId: this.selectedSprint.id,
          });
        });

        this._toastMessageService.showSuccess('Item Created', 'Successful');
        this.resetDialogNew();
        this.hideDialog();

        this.sub.unsubscribe();
        this.ngOnInit(this.selectedSprint);
      } catch (error: any) {
        this.resetDialogNew();
        this.hideDialog();
        this._toastMessageService.showError(error.message, `Error while creating item`);
      }
    }

    this.items = [...this.items];
    this.dialogUpdate = false;
    const tempStatus = this.item.status as TaskStatus;
    const tempType = this.item.type as TaskType;
    this.item = { status: tempStatus, type: tempType };
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

  getInitials(user: any): string {
    return '' + user.firstname.charAt(0) + '' + user.lastname.charAt(0);
  }

  async updateTasks(sprint: Sprint) {
    this.selectedSprint = sprint;
    // console.log(this.selectedSprint);

    const a = await this._ipcService.query<Task[]>(appIpcs.retrieveAllTasksBySprint, this.selectedSprint.id);

    this.items = a;
    this.item = this.items[0];
  }

  convertUserUserTypeProjectIntoUsers(usersTypeProject: UserUserTypeProject[]): User[] {
    const result: User[] = [];

    usersTypeProject.forEach((el) => {
      if (el.user) {
        result.push(el.user);
      }
    });

    return result;
  }

  async filterUsers(task: Task) {
    const usersProject: UserUserTypeProject[] = await this._ipcService.query<UserUserTypeProject[]>(
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
    const tasksProject: Task[] = await this._ipcService.query<Task[]>(
      appIpcs.retrieveAllTasksByProject,
      this.selectedProject.id
    );

    let tasksSprint: Task[] = await this._ipcService.query<Task[]>(
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
