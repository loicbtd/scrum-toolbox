import { Component, OnInit } from '@angular/core';
import { MyProfileState, ToastMessageService } from '@libraries/lib-angular';
import { appIpcs, UserEntity, UserModel } from '@libraries/lib-scrum-toolbox';
import { IpcService } from '../../../../global/services/ipc.service';
import { ConfirmationService } from 'primeng/api';
import { Store } from '@ngxs/store';
import { MyProfileModel } from '../../../../global/models/my-profile.model';

@Component({
  templateUrl: './crud-users.component.html',
  styleUrls: ['./crud-users.component.scss'],
})
export class CrudUsersComponent implements OnInit {
  dialog: boolean;

  items: UserModel[];

  item: UserEntity;

  selectedItems: UserModel[];

  submitted: boolean;

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
    this.items = await this._ipcService.query<UserModel[]>(appIpcs.retrieveAllUsers);
    this.item = this.items[0];
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
          const myProfile = this._store.selectSnapshot<MyProfileModel>(MyProfileState);

          if (myProfile.user.id == item.id) {
            this._toastMessageService.showError('Impossible to self-suppress.', 'Error while deleting item');
            continue;
          }

          try {
            await this._ipcService.query(appIpcs.deleteUser, item.id);
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

  editItem(item: UserModel) {
    this.item = { ...item };
    this.dialog = true;
  }

  async deleteItem(item: UserModel) {
    const myProfile = this._store.selectSnapshot<MyProfileModel>(MyProfileState);

    if (myProfile.user.id == item.id) {
      this._toastMessageService.showError('Impossible to self-suppress.', 'Error while deleting item');
      return;
    }

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
      } catch (error: any) {
        this._toastMessageService.showError(error.message, `Error while updating item`);
      }
    } else {
      try {
        this.item = await this._ipcService.query<UserModel>(appIpcs.createUser, this.item);
        this.items.push(this.item);
        this._toastMessageService.showSuccess('Item Created', 'Successful');
      } catch (error: any) {
        this._toastMessageService.showError(error.message, `Error while creating item`);
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
