import { Component, OnInit } from '@angular/core';
import { ToastMessageService } from '@libraries/lib-angular';
import { appIpcs, errorsName, TaskTypeEntity } from '@libraries/lib-scrum-toolbox';
import { IpcService } from '../../../../global/services/ipc.service';
import { ConfirmationService } from 'primeng/api';

@Component({
  templateUrl: './crud-task-type.component.html',
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
export class CrudTaskTypeComponent implements OnInit {
  items: TaskTypeEntity[];

  item: TaskTypeEntity;

  selectedItems: TaskTypeEntity[];

  submitted: boolean;

  dialog: boolean;

  labelDisabled = false;

  constructor(
    private readonly _toastMessageService: ToastMessageService,
    private readonly _confirmationService: ConfirmationService,
    private readonly _ipcService: IpcService
  ) {}

  async ngOnInit() {
    this.items = await this._ipcService.query<TaskTypeEntity[]>(appIpcs.retrieveAllTasksType);
  }

  openNew() {
    this.item = new TaskTypeEntity();
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

  editItem(item: TaskTypeEntity) {
    this.item = { ...item };
    this.labelDisabled = true;
    this.dialog = true;
  }

  async deleteItem(item: TaskTypeEntity) {
    this._confirmationService.confirm({
      message: 'Are you sure you want to delete the item ?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        await this.validateDeleteItem(item);
        this.item = new TaskTypeEntity();
      },
    });
  }

  async validateDeleteItem(item: TaskTypeEntity) {
    try {
      await this._ipcService.query(appIpcs.deleteTaskType, item.id);
      this.items = this.items.filter((_) => _.id !== item.id);
      this._toastMessageService.showSuccess('Item Deleted', 'Successful');
    } catch (error: any) {
      this._toastMessageService.showError('Unable to delete item', 'Error');
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
          await this._ipcService.query(appIpcs.updateTaskType, this.item);
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
            this.item = await this._ipcService.query<TaskTypeEntity>(appIpcs.createTaskType, this.item);
            this.items.push(this.item);
            this._toastMessageService.showSuccess('Item Created', 'Successful');
          } catch (error: any) {
            this._toastMessageService.showError(error.message, `Error while creating item`);
          }
        }
      }
      this.items = [...this.items];
      this.dialog = false;
      this.item = new TaskTypeEntity();
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
