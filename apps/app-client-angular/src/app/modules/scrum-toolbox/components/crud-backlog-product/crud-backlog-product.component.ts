import { Component, OnDestroy, OnInit } from '@angular/core';
import { ToastMessageService } from '@libraries/lib-angular';
import {
  appIpcs,
  ProjectEntity,
  SprintEntity,
  TaskEntity,
  TaskStatusEntity,
  TaskTypeEntity,
  UserEntity,
} from '@libraries/lib-scrum-toolbox';
import { IpcService } from '../../../../global/services/ipc.service';
import { ConfirmationService } from 'primeng/api';
import { Select } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { ProjectContextState } from '../../store/states/project-context.state';

@Component({
  templateUrl: './crud-backlog-product.component.html',
  styleUrls: ['./crud-backlog-product.component.scss'],
})
export class CrudBacklogProductComponent implements OnInit, OnDestroy {
  @Select(ProjectContextState.project) project$: Observable<ProjectEntity>;

  @Select(ProjectContextState.sprint) sprint$: Observable<SprintEntity>;

  @Select(ProjectContextState.availableSprints) availableSprints$: Observable<SprintEntity[]>;

  projectChangeSubscription: Subscription;

  dialog: boolean;

  selectedItems: TaskEntity[];
  items: TaskEntity[];
  item: TaskEntity;

  submitted: boolean;

  availableTaskTypes: TaskTypeEntity[];

  availableSprints: SprintEntity[];

  get isCreationMode() {
    return !this.item.id;
  }

  constructor(
    private readonly _toastMessageService: ToastMessageService,
    private readonly _confirmationService: ConfirmationService,
    private readonly _ipcService: IpcService
  ) {}

  async ngOnInit() {
    this.availableTaskTypes = await this._ipcService.query<TaskTypeEntity[]>(appIpcs.retrieveAllTasksType);

    this.projectChangeSubscription = this.project$.subscribe(async (project) => {
      if (!project) {
        return;
      }

      this.items = await this._ipcService.query<TaskEntity[]>(appIpcs.retrieveAllTasksByProject, project.id);

      this.availableSprints = await this._ipcService.query<TaskEntity[]>(
        appIpcs.retrieveAllSprintsByProject,
        project.id
      );
    });
  }

  ngOnDestroy(): void {
    this.projectChangeSubscription.unsubscribe();
  }

  openNew() {
    this.item = {};
    this.submitted = false;
    this.dialog = true;
  }

  deleteSelectedItems() {
    this._confirmationService.confirm({
      message: 'Are you sure you want to delete the selected items?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        for (const item of this.selectedItems) {
          try {
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

  async editItem(item: TaskEntity) {
    this.item = { ...item };
    this.dialog = true;
  }

  async deleteItem(item: TaskEntity) {
    this._confirmationService.confirm({
      message: 'Are you sure you want to delete the item ?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        try {
          await this._ipcService.query(appIpcs.deleteTask, item.id);

          this._toastMessageService.showSuccess('Item Deleted', 'Successful');
        } catch (error) {
          this._toastMessageService.showError(`Error while deleting item`);
        }
      },
    });
  }

  hideDialog() {
    this.dialog = false;
    this.submitted = false;
  }

  async saveItem() {
    this.submitted = true;

    if (this.item.id) {
      try {
        if (!this.item.sprint) {
          await this._ipcService.query(appIpcs.unassignTaskToSprint, this.item.id);
        }

        await this._ipcService.query(appIpcs.updateTask, this.item);

        this._toastMessageService.showSuccess('Item Updated', 'Successful');

        this.items[this.findIndexById(this.item.id)] = this.item;
      } catch (error: any) {
        this._toastMessageService.showError(error.message, `Error while updating item`);
      }
    } else {
      try {
        this.item = await this._ipcService.query<TaskEntity>(appIpcs.createTask, this.item);

        await this._ipcService.query(appIpcs.updateTask, this.item);

        this._toastMessageService.showSuccess('Item Created', 'Successful');

        this.items = [...this.items, this.item];
      } catch (error: any) {
        this._toastMessageService.showError(error.message, `Error while creating item`);
      }
    }

    this.dialog = false;
  }

  findIndexById(id: string): number {
    let index = -1;
    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  }

  getColorForTaskStatus(taskStatus: TaskStatusEntity): object {
    return taskStatus ? { 'background-color': taskStatus?.backgroundColor, color: taskStatus?.textColor } : {};
  }

  getColorForTaskType(taskType: TaskTypeEntity): object {
    return taskType ? { 'background-color': taskType.backgroundColor, color: taskType?.textColor } : {};
  }

  getColorForSprint(task: TaskEntity): object {
    return task.sprint ? {} : { 'background-color': '#6fa8dc', color: '#ffffff' };
  }

  getInitials(user: UserEntity): string {
    return `${user.firstname?.charAt(0)}${user.lastname?.charAt(0)}`;
  }

  getName(user: UserEntity) {
    return `${
      user.firstname?.charAt(0).toUpperCase() + (user.firstname || '').slice(1)
    } ${user.lastname?.toUpperCase()}`;
  }
}
