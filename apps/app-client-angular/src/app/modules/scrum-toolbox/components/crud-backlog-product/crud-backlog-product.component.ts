import { Component, OnDestroy, OnInit } from '@angular/core';
import { ToastMessageService } from '@libraries/lib-angular';
import { appIpcs, TaskEntity, TaskStatusEntity, TaskTypeEntity, UserEntity } from '@libraries/lib-scrum-toolbox';
import { IpcService } from '../../../../global/services/ipc.service';
import { ConfirmationService } from 'primeng/api';
import { Select, Store } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { ProjectContextState } from '../../store/states/project-context.state';
import { ProjectContextModel } from '../../models/project-context.model';

@Component({
  templateUrl: './crud-backlog-product.component.html',
  styleUrls: ['./crud-backlog-product.component.scss'],
})
export class CrudBacklogProductComponent implements OnInit, OnDestroy {
  @Select(ProjectContextState) context$: Observable<ProjectContextModel>;

  contextChangeSubscription: Subscription;

  dialog: boolean;

  selectedItems: TaskEntity[];
  items: TaskEntity[];
  item: TaskEntity;

  submitted: boolean;

  availableTaskTypes: TaskTypeEntity[];
  availableTaskStatuses: TaskStatusEntity[];

  capa: number | undefined;

  get isCreationMode() {
    return !this.item.id;
  }

  constructor(
    private readonly _toastMessageService: ToastMessageService,
    private readonly _confirmationService: ConfirmationService,
    private readonly _ipcService: IpcService,
    private readonly _store: Store
  ) {}

  async ngOnInit() {
    this.availableTaskTypes = await this._ipcService.query<TaskTypeEntity[]>(appIpcs.retrieveAllTasksType);

    this.availableTaskStatuses = await this._ipcService.query<TaskStatusEntity[]>(appIpcs.retrieveAllTasksStatus);

    this.contextChangeSubscription = this.context$.subscribe(async (context) => {
      if (!context.project) {
        return;
      }

      this.items = await this._ipcService.query<TaskEntity[]>(appIpcs.retrieveAllTasksByProject, context.project.id);
    });
  }

  ngOnDestroy(): void {
    this.contextChangeSubscription.unsubscribe();
  }

  openNew() {
    this.item = { project: this._store.selectSnapshot<ProjectContextModel>(ProjectContextState).project };
    this.capa = 5;
    this.item = {  capacity: this.capa };
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

      if (this.item.label === '' || this.item.description === '') {
        return;
      }

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
