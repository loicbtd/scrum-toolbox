import { Component } from '@angular/core';
import { ToastMessageService } from '@libraries/lib-angular';
import { appIpcs, Sprint, Task, TaskStatus, TaskType } from '@libraries/lib-scrum-toolbox';
import { IpcService } from '../../../../global/services/ipc.service';
import { ConfirmationService } from 'primeng/api';

@Component({
  templateUrl: './crud-backlog-sprint.component.html',
  styleUrls: ['./crud-backlog-sprint.component.scss'],
})
export class CrudBacklogSprintComponent {
  dialog: boolean;

  sprints: Sprint[];

  selectedSprint: Sprint;

  items: Task[];

  item: Task;

  selectedItems: Task[];

  submitted: boolean;

  get isCreationMode() {
    return !this.item.id;
  }

  constructor(
    private readonly _toastMessageService: ToastMessageService,
    private readonly _confirmationService: ConfirmationService,
    private readonly _ipcService: IpcService
  ) {}

  async ngOnInit() {
    //TODO
    // this.sprints = await this._ipcService.query<Sprint[]>(appIpcs.retrieveAllSprintsByProject);
    this.sprints = await this._ipcService.query<Sprint[]>(appIpcs.retrieveAllSprints);
    this.selectedSprint = this.sprints[0];

    this.items = await this._ipcService.query<Task[]>(appIpcs.retrieveAllTasks);
    this.item = this.items[0];
  }

  openNew() {
    const tempStatus = this.item.status as TaskStatus;
    const tempType = this.item.type as TaskType;
    this.item = {status: tempStatus, type: tempType};
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
            this.items = this.items.filter((_) => _.id !== item.id);
          } catch (error) {
            this._toastMessageService.showError('Error while deleting item');
          }
        }
        this.selectedItems = [];

        this._toastMessageService.showSuccess('Items Deleted', 'Successful');
      },
    });
  }

  editItem(item: Task) {
    this.item = { ...item };
    this.dialog = true;
  }

  async deleteItem(item: Task) {
    this._confirmationService.confirm({
      message: 'Are you sure you want to delete the item ?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        try {
          await this._ipcService.query(appIpcs.deleteTask, item.id);
          this.items = this.items.filter((_) => _.id !== item.id);
          const tempStatus = this.item.status as TaskStatus;
          const tempType = this.item.type as TaskType;
          this.item = {status: tempStatus, type: tempType};
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
        await this._ipcService.query(appIpcs.updateTask, this.item);
        this.items[this.findIndexById(this.item.id)] = this.item;
        this._toastMessageService.showSuccess('Item Updated', 'Successful');
      } catch (error: any) {
        this._toastMessageService.showError(error.message, `Error while updating item`);
      }
    } else {
      try {
        this.item = await this._ipcService.query<Task>(appIpcs.createTask, this.item);
        this.items.push(this.item);
        this._toastMessageService.showSuccess('Item Created', 'Successful');
      } catch (error: any) {
        this._toastMessageService.showError(error.message, `Error while creating item`);
      }
    }

    this.items = [...this.items];
    this.dialog = false;
    const tempStatus = this.item.status as TaskStatus;
    const tempType = this.item.type as TaskType;
    this.item = {status: tempStatus, type: tempType};
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

  selectColorStatus(it: any): object {
    return {"background-color": it.status.color};
    // return {"background-color": it.status.color, "color": it.status.textColor};
  }

  selectColorType(it: any): object {
    return {"background-color": it.type.color};
    // return {"background-color": it.type.color, "color": it.type.textColor};
  }

}
