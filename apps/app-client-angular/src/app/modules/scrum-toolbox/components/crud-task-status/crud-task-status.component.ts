import { Component, OnInit } from '@angular/core';
import { ToastMessageService } from '@libraries/lib-angular';
import { appIpcs, errorsName, TaskStatusEntity } from '@libraries/lib-scrum-toolbox';
import { IpcService } from '../../../../global/services/ipc.service';
import { ConfirmationService } from 'primeng/api';

@Component({
  templateUrl: './crud-task-status.component.html',
  styles: [
    `
      .p-invalid {
        color: red !important;
      }
      th {
        white-space: nowrap;
      }
    `,
  ],
})
export class CrudTaskStatusComponent implements OnInit {
  items: TaskStatusEntity[];

  item: TaskStatusEntity;

  selectedItems: TaskStatusEntity[];

  submitted: boolean;

  dialog: boolean;

  labelDisabled = false;

  constructor(
    private readonly _toastMessageService: ToastMessageService,
    private readonly _confirmationService: ConfirmationService,
    private readonly _ipcService: IpcService
  ) {}

  async ngOnInit() {
    this.items = await this._ipcService.query<TaskStatusEntity[]>(appIpcs.retrieveAllTasksStatus);
  }

  openNew() {
    this.item = new TaskStatusEntity();
    this.submitted = this.labelDisabled = false;
    this.dialog = true;
  }

  deleteSelectedItems() {
    this._confirmationService.confirm({
      message: 'Are you sure you want to delete the selected items?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        for (const item of this.selectedItems) {
          await this.validateDeleteItem(item);
        }
        this.selectedItems = [];
      },
    });
  }

  editItem(item: TaskStatusEntity) {
    this.item = { ...item };
    this.labelDisabled = true;
    this.dialog = true;
  }

  async deleteItem(item: TaskStatusEntity) {
    this._confirmationService.confirm({
      message: 'Are you sure you want to delete the item ?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        await this.validateDeleteItem(item);
        this.item = new TaskStatusEntity();
      },
    });
  }

  async validateDeleteItem(item: TaskStatusEntity) {
    try {
      await this._ipcService.query(appIpcs.deleteTaskStatus, item.id);
      this.items = this.items.filter((_) => _.id !== item.id);
      this._toastMessageService.showSuccess('Item Deleted', 'Successful');
    } catch (error: any) {
      let errorText = 'Error while deleting item';
      if (error.message === errorsName.statusIsCurrentlyUsed) {
        errorText = 'This status is currently used by item';
      }
      this._toastMessageService.showError(errorText);
    }
  }

  hideDialog() {
    this.dialog = false;
    this.submitted = false;
  }

  async saveItem() {
    this.submitted = true;
    if (this.item.label && this.item.textColor && this.item.backgroundColor) {
      if (this.item.id) {
        try {
          await this._ipcService.query(appIpcs.updateTaskStatus, this.item);
          this.items[this.findIndexById(this.item.id)] = this.item;
          this._toastMessageService.showSuccess('Item Updated', 'Successful');
        } catch (error: any) {
          this._toastMessageService.showError(error.message, `Error while updating item`);
        }
      } else {
        if (
          this.items.find((it) => it.label?.trim().toLocaleLowerCase() === this.item.label?.trim().toLocaleLowerCase())
        ) {
          this._toastMessageService.showError('This label already exists', `Error`);
        } else {
          try {
            this.item = await this._ipcService.query<TaskStatusEntity>(appIpcs.createTaskStatus, this.item);
            this.items.push(this.item);
            this._toastMessageService.showSuccess('Item Created', 'Successful');
          } catch (error: any) {
            this._toastMessageService.showError(error.message, `Error while creating item`);
          }
        }
      }
      this.items = [...this.items];
      this.dialog = false;
      this.item = new TaskStatusEntity();
    }
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
}
