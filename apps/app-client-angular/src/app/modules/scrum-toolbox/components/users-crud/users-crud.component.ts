import { Component } from '@angular/core';
import { ToastMessageService } from '@libraries/lib-angular';
import { appIpcs, User } from '@libraries/lib-scrum-toolbox';
import { IpcService } from '../../../../../app/global/services/ipc.service';
import { ConfirmationService } from 'primeng/api';

@Component({
  templateUrl: './users-crud.component.html',
  styleUrls: ['./users-crud.component.scss'],
})
export class UsersCrudComponent {
  dialog: boolean;

  items: User[];

  item: User;

  selectedItems: User[];

  submitted: boolean;

  constructor(
    private readonly _toastMessageService: ToastMessageService,
    private readonly _confirmationService: ConfirmationService,
    private readonly _ipcService: IpcService
  ) {}

  async ngOnInit() {
    this.items = await this._ipcService.query<User[]>(appIpcs.retrieveAllUsers);
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
            await this._ipcService.query(appIpcs.deleteUser, item.id);
            this.items = this.items.filter((_) => _.id !== item.id);
          } catch (error) {
            this._toastMessageService.showError(`Error while deleting item`);
          }
        }
        this.selectedItems = [];

        this._toastMessageService.showSuccess('Items Deleted', 'Successful');
      },
    });
  }

  editItem(item: User) {
    this.item = { ...item };
    this.dialog = true;
  }

  async deleteItem(item: User) {
    this._confirmationService.confirm({
      message: 'Are you sure you want to delete the item ?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        try {
          await this._ipcService.query(appIpcs.deleteUser, item.id);
          this.items = this.items.filter((_) => _.id !== item.id);
          this.item = {};
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
        await this._ipcService.query(appIpcs.updateUser, this.item);
        this.items[this.findIndexById(this.item.id)] = this.item;
        this._toastMessageService.showSuccess('Item Updated', 'Successful');
      } catch (error) {
        this._toastMessageService.showError(`Error while updating item`);
      }
    } else {
      try {
        this.item = await this._ipcService.query<User>(appIpcs.createUser, this.item);
        this.items.push(this.item);
        this._toastMessageService.showSuccess('Item Created', 'Successful');
      } catch (error) {
        this._toastMessageService.showError(`Error while updating item`);
      }
    }

    this.items = [...this.items];
    this.dialog = false;
    this.item = {};
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
