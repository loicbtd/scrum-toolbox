import { Component, OnInit } from '@angular/core';
import { ToastMessageService } from '@libraries/lib-angular';
import { appIpcs, ProjectEntity, UserEntity } from '@libraries/lib-scrum-toolbox';
import { IpcService } from '../../../../global/services/ipc.service';
import { ConfirmationService } from 'primeng/api';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { ProjectContextState } from '../../store/states/project-context.state';
import { ProjectContextModel } from '../../models/project-context.model';
import { ProjectContextService } from '../../services/project-context.service';

@Component({
  templateUrl: './crud-projects.component.html',
  styleUrls: ['./crud-projects.component.scss'],
})
export class CrudProjectsComponent implements OnInit {
  items: ProjectEntity[];
  item: ProjectEntity;
  selectedItems: ProjectEntity[];

  submitted: boolean;

  dialog: boolean;
  attendeesDialog: boolean;

  productOwners: UserEntity[];
  availableProductOwners: UserEntity[];

  scrumMasters: UserEntity[];
  availableScrumMasters: UserEntity[];

  developers: UserEntity[];
  availableDevelopers: UserEntity[];

  @Select(ProjectContextState) projectContext$: Observable<ProjectContextModel>;

  constructor(
    private readonly _toastMessageService: ToastMessageService,
    private readonly _confirmationService: ConfirmationService,
    private readonly _ipcService: IpcService,
    private readonly _projectContextService: ProjectContextService
  ) {}

  async ngOnInit() {
    this.items = await this._ipcService.query<ProjectEntity[]>(appIpcs.retrieveAllProjects);
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
            await this._ipcService.query(appIpcs.deleteProject, item.id);
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

  editItem(item: ProjectEntity) {
    this.item = { ...item };
    this.dialog = true;
  }

  async deleteItem(item: ProjectEntity) {
    this._confirmationService.confirm({
      message: 'Are you sure you want to delete the item ?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        try {
          await this._ipcService.query(appIpcs.deleteProject, item.id);
          this.items = this.items.filter((_) => _.id !== item.id);
          this.item = {};
          this._toastMessageService.showSuccess('Item Deleted', 'Successful');
        } catch (error) {
          this._toastMessageService.showError('Unable to delete item', 'Error');
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
        await this._ipcService.query(appIpcs.updateProject, this.item);
        this.items[this.findIndexById(this.item.id)] = this.item;
        this._projectContextService.refreshAvailableProjects();
        this._toastMessageService.showSuccess('Item Updated', 'Successful');
      } catch (error: any) {
        this._toastMessageService.showError(error.message, `Error while updating item`);
      }
    } else {
      try {
        this.item = await this._ipcService.query<ProjectEntity>(appIpcs.createProject, this.item);
        this.items.push(this.item);
        this._projectContextService.refreshAvailableProjects();
        this._toastMessageService.showSuccess('Item Created', 'Successful');
      } catch (error: any) {
        this._toastMessageService.showError(error.message, `Error while creating item`);
      }
    }

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

  async editAttendees(item: ProjectEntity) {
    this.productOwners = await this._ipcService.query<UserEntity[]>(appIpcs.retrieveProductOwnersOfProject, item.id);
    this.scrumMasters = await this._ipcService.query<UserEntity[]>(appIpcs.retrieveScrumMastersOfProject, item.id);
    this.developers = await this._ipcService.query<UserEntity[]>(appIpcs.retrieveDevelopersOfProject, item.id);
    this.attendeesDialog = true;
  }

  hideAttendesDialog() {
    this.attendeesDialog = false;
    this.productOwners = [];
    this.developers = [];
    this.scrumMasters = [];
  }

  saveAttendees() {
    console.log();
  }
}
