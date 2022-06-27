import { Component, OnDestroy, OnInit } from '@angular/core';
import { ToastMessageService } from '@libraries/lib-angular';
import { appIpcs, ProjectEntity, SprintEntity, SprintStatusEntity } from '@libraries/lib-scrum-toolbox';
import { IpcService } from '../../../../global/services/ipc.service';
import { ConfirmationService } from 'primeng/api';
import { Select } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { ProjectContextState } from '../../store/states/project-context.state';
import { ProjectContextModel } from '../../models/project-context.model';

@Component({
  templateUrl: './crud-sprint.component.html',
  styleUrls: ['./crud-sprint.component.scss'],
})
export class CrudSprintComponent implements OnInit, OnDestroy {
  @Select(ProjectContextState) context$: Observable<ProjectContextModel>;

  dialogNew: boolean;
  dialogUpdate: boolean;

  items: SprintEntity[];
  item: SprintEntity;

  selectedItems: SprintEntity[];

  selectedProject: ProjectEntity;

  submitted: boolean;

  contextChangeSubscription: Subscription;

  form = this.fb.group({
    label: ['', [Validators.required]],
    startDate: ['', [Validators.required]],
    endDate: ['', [Validators.required]],
    selectedProjectForm: ['', [Validators.required]],
  });

  sprint: SprintEntity;

  projects: ProjectEntity[];
  selectedProjectForm: ProjectEntity;

  startWrong: boolean;
  endWrong: boolean;
  minStartDate: Date;
  minEndDate: Date;

  sprintStatus: SprintStatusEntity[];
  selectedStatus: SprintStatusEntity;

  minDateSprint: Date;
  maxDateSprint: Date;

  get isCreationMode() {
    return !this.item.id;
  }

  constructor(
    private readonly _toastMessageService: ToastMessageService,
    private readonly _confirmationService: ConfirmationService,
    private readonly _ipcService: IpcService,
    private readonly fb: UntypedFormBuilder
  ) {}

  async ngOnInit() {
    this.projects = await this._ipcService.query<ProjectEntity[]>(appIpcs.retrieveAllProjects);
    this.sprintStatus = await this._ipcService.query<SprintStatusEntity[]>(appIpcs.retrieveAllSprintsStatus);
    this.selectedStatus = this.sprintStatus[0];
  }

  ngOnDestroy(): void {
    console.log();

    // this.contextChangeSubscription.unsubscribe();
  }

  openNew() {
    this.minStartDate = new Date();
    this.minDateSprint = this.minStartDate;
    this.minEndDate = new Date(this.minStartDate.getTime() + 7 * 24 * 60 * 60 * 1000);
    this.maxDateSprint = this.minEndDate;

    this.item = {};
    this.submitted = false;
    this.dialogNew = true;
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

    if (this.item.start_date && this.item.end_date) {
      this.minStartDate = new Date(this.item.start_date);
      this.minDateSprint = this.minStartDate;
      this.minEndDate = new Date(this.minStartDate.getTime() + 7 * 24 * 60 * 60 * 1000);
      this.maxDateSprint = this.minEndDate;
    }

    if (item.status) {
      this.selectedStatus = item.status;
    }
    this.dialogUpdate = true;
  }

  async deleteItem(item: SprintEntity) {
    this._confirmationService.confirm({
      message: 'Are you sure you want to delete the item ?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        try {
          await this._ipcService.query(appIpcs.deleteSprint, { id: item.id });

          this._toastMessageService.showSuccess('Item Deleted', 'Successful');
        } catch (error) {
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
        if (this.minDateSprint < new Date('dd/MM/yyyy') || this.maxDateSprint < this.minDateSprint) {
          throw new Error('Start Date or End Date invalid');
        }

        if (this.item.label === '') {
          return;
        }

        this.item.status = this.selectedStatus;
        // this.item.start_date = this.minDateSprint.toString();
        // this.item.end_date = this.maxDateSprint.toString();

        await this._ipcService.query(appIpcs.updateSprint, this.item);

        this._toastMessageService.showSuccess('Item Updated', 'Successful');
      } catch (error: any) {
        this._toastMessageService.showError(error.message, `Error while updating item`);
      }
    }

    this.items = [...this.items];
    this.dialogUpdate = false;
    this.dialogNew = false;
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

  selectColorStatus(it: any): object {
    return { 'background-color': it.status.backgroundColor, color: it.status.textColor };
  }

  selectColorWithStatus(it: any): object {
    return { 'background-color': it.backgroundColor, color: it.textColor };
  }

  async saveSprint() {
    this.submitted = true;
    this.startWrong = false;
    this.endWrong = false;

    if (this.form.invalid) {
      this.submitted = false;
      return;
    }

    this.sprint = new SprintEntity();
    this.sprint.label = this.form.get('label')?.value;

    if (this.form.get('startDate')?.value < new Date('dd/MM/yyyy')) {
      this.startWrong = true;
      return;
    }
    if (this.form.get('endDate')?.value < this.form.get('startDate')?.value) {
      this.endWrong = true;
      return;
    }

    try {
      this.sprint.start_date = this.form.get('startDate')?.value;
      this.sprint.end_date = this.form.get('endDate')?.value;

      this.sprint.project = this.selectedProject;
      this.sprint.status = this.sprintStatus.find((status) => {
        return status.label === this.sprintStatus[0].label;
      });

      await this._ipcService.query<SprintEntity>(appIpcs.createSprint, this.sprint);

      this._toastMessageService.showSuccess('Sprint Created', 'Successful');

      this.form.reset();
      this.submitted = false;
      this.startWrong = false;
      this.endWrong = false;

      this.hideDialog();
    } catch (error: any) {
      this._toastMessageService.showError(error.message, `Error while creating Sprint`);
    }
  }
}
