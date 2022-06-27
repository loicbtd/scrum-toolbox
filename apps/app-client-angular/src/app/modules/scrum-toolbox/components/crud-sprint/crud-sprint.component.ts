import { Component, OnDestroy, OnInit } from '@angular/core';
import { ToastMessageService } from '@libraries/lib-angular';
import { appIpcs, SprintEntity, SprintStatusEntity } from '@libraries/lib-scrum-toolbox';
import { IpcService } from '../../../../global/services/ipc.service';
import { ConfirmationService } from 'primeng/api';
import { Select, Store } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { ProjectContextState } from '../../store/states/project-context.state';
import { ProjectContextModel } from '../../models/project-context.model';
import { RefreshAvailableSprints } from '../../store/actions/project-context.actions';

@Component({
  templateUrl: './crud-sprint.component.html',
  styleUrls: ['./crud-sprint.component.scss'],
})
export class CrudSprintComponent implements OnInit, OnDestroy {
  @Select(ProjectContextState) context$: Observable<ProjectContextModel>;

  contextChangeSubscription: Subscription;

  items: SprintEntity[];
  item: SprintEntity;
  selectedItems: SprintEntity[];

  dialog: boolean;

  submitted: boolean;

  availableSprintStatus: SprintStatusEntity[];

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
    this.availableSprintStatus = await this._ipcService.query<SprintStatusEntity[]>(appIpcs.retrieveAllSprintsStatus);

    this.contextChangeSubscription = this.context$.subscribe(async (context) => {
      this.items = await this._ipcService.query<SprintEntity[]>(
        appIpcs.retrieveAllSprintsByProject,
        context.project?.id
      );
    });
  }

  ngOnDestroy(): void {
    this.contextChangeSubscription.unsubscribe();
  }

  openNew() {
    const context = this._store.selectSnapshot<ProjectContextModel>(ProjectContextState);

    this.item = { project: context.project, startDate: new Date(), endDate: new Date() };

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
            await this._ipcService.query(appIpcs.deleteSprint, { id: item.id });
            this.items = this.items.filter((_) => _.id !== item.id);
            this._store.dispatch(new RefreshAvailableSprints(this.items));
          } catch (error) {
            this._toastMessageService.showError('Error while deleting item');
          }
        }

        this.selectedItems = [];

        this._toastMessageService.showSuccess('Items Deleted', 'Successful');
      },
    });
  }

  editItem(item: SprintEntity) {
    this.item = { ...item };

    this.dialog = true;
  }

  async deleteItem(item: SprintEntity) {
    this._confirmationService.confirm({
      message: 'Are you sure you want to delete the item ?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        try {
          await this._ipcService.query(appIpcs.deleteSprint, { id: item.id });
          this.items = this.items.filter((_) => _.id !== item.id);
          this._store.dispatch(new RefreshAvailableSprints(this.items));
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

    if (!this.item.startDate || !this.item.endDate) {
      this._toastMessageService.showError('Start and end dates must be defined');
      return;
    }

    if (this.item.startDate > this.item.endDate) {
      this._toastMessageService.showError('Start date must be befort end date');
      return;
    }

    if (this.item.id) {
      try {
        await this._ipcService.query(appIpcs.updateSprint, this.item);
        this.items[this.findIndexById(this.item.id)] = this.item;
        this._store.dispatch(new RefreshAvailableSprints(this.items));
        this._toastMessageService.showSuccess('Item Updated', 'Successful');
      } catch (error: any) {
        this._toastMessageService.showError(error.message, `Error while updating item`);
      }
    } else {
      try {
        this.item = await this._ipcService.query<SprintEntity>(appIpcs.createSprint, this.item);
        this.items.push(this.item);
        this._store.dispatch(new RefreshAvailableSprints(this.items));
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

  getColorForSprintStatus(sprintStatus: SprintStatusEntity): object {
    return { 'background-color': sprintStatus.backgroundColor, color: sprintStatus.textColor };
  }
}
