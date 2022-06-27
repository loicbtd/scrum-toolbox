import { Component } from '@angular/core';
import { CurrentProjectState, ToastMessageService } from '@libraries/lib-angular';
import {
  appIpcs,
  ProjectEntity,
  SprintEntity,
  TaskEntity,
  TaskStatusEntity,
  TaskTypeEntity,
} from '@libraries/lib-scrum-toolbox';
import { IpcService } from '../../../../global/services/ipc.service';
import { ConfirmationService } from 'primeng/api';
import { Select, Store } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { CurrentProjectModel } from '../../../../global/models/current-project.model';

@Component({
  templateUrl: './crud-backlog-product.component.html',
  styleUrls: ['./crud-backlog-product.component.scss'],
})
export class CrudBacklogProductComponent {
  @Select(CurrentProjectState) currentProject$: Observable<CurrentProjectModel>;

  dialogUpdate: boolean;
  dialogNew: boolean;

  items: TaskEntity[];
  item: TaskEntity;

  selectedItems: TaskEntity[];

  submitted: boolean;

  selectedProject: ProjectEntity;

  tasks: TaskEntity[];

  taskType: TaskTypeEntity[];
  selectedType: TaskTypeEntity;

  selectedSprint: SprintEntity | undefined;
  projectSprints: SprintEntity[];

  sub: Subscription;
  sprintNull: SprintEntity;

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
    this.taskType = await this._ipcService.query<TaskTypeEntity[]>(appIpcs.retrieveAllTasksType);
    this.selectedType = this.taskType[0];

    this.sprintNull = new SprintEntity();
    this.sprintNull.label = 'not assigned';

    this.sub = this.currentProject$.subscribe(async (data: CurrentProjectModel) => {
      if (data) {
        this.selectedProject = data.project;

        this.items = await this._ipcService.query<TaskEntity[]>(
          appIpcs.retrieveAllTasksByProject,
          this.selectedProject.id
        );
        this.item = this.items[0];

        this.projectSprints = await this._ipcService.query<SprintEntity[]>(appIpcs.retrieveAllSprintsByProject, {
          id: this.selectedProject.id,
        });
        this.selectedSprint = this.projectSprints[0];
        this.projectSprints.push(this.sprintNull);
      }
    });
  }

  openNew() {
    const tempStatus = this.item?.status as TaskStatusEntity;
    const tempType = this.item?.type as TaskTypeEntity;
    this.capa = 5;
    this.item = { status: tempStatus, type: tempType, capacity: this.capa };
    this.selectedSprint = this.sprintNull;
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
            await this._ipcService.query(appIpcs.deleteTask, item.id);
          } catch (error) {
            this._toastMessageService.showError('Error while deleting item');
          }
        }
        this.selectedItems = [];

        this._toastMessageService.showSuccess('Items Deleted', 'Successful');
        this.refresh();
      },
    });
  }

  editItem(item: TaskEntity) {
    this.item = { ...item };
    this.selectedType = item.type;
    this.capa = item.capacity;


    if (item.sprint) {
      this.selectedSprint = item.sprint;
    } else {
      this.selectedSprint = this.sprintNull;
    }

    this.dialogUpdate = true;
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

          this.refresh();
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

      if (this.item.label === '' || this.item.description === '') {
        return;
      }

      try {
        this.item.type = this.selectedType;
        this.item.capacity = this.capa;

        if (this.selectedSprint?.label === this.sprintNull.label) {
          await this._ipcService.query(appIpcs.unassignTaskToSprint, this.item.id);
          this.item.sprint = undefined;
        } else {
          this.item.sprint = this.selectedSprint;
        }

        await this._ipcService.query(appIpcs.updateTask, this.item);

        this._toastMessageService.showSuccess('Item Updated', 'Successful');

        this.refresh();
      } catch (error: any) {
        this._toastMessageService.showError(error.message, `Error while updating item`);
      }
    } else {
     
      try {
        this.item.type = this.selectedType;
        this.item.project = this.selectedProject;
        this.item.capacity = this.capa;

        this.item = await this._ipcService.query<TaskEntity>(appIpcs.createTask, this.item);

        if (this.selectedSprint?.label === this.sprintNull.label) {
          await this._ipcService.query(appIpcs.unassignTaskToSprint, this.item.id);
          this.item.sprint = undefined;
        } else {
          this.item.sprint = this.selectedSprint;
        }

        await this._ipcService.query(appIpcs.updateTask, this.item);

        this._toastMessageService.showSuccess('Item Created', 'Successful');

        this.refresh();
      } catch (error: any) {
        this._toastMessageService.showError(error.message, `Error while creating item`);
      }
    }

    this.items = [...this.items];
    this.dialogUpdate = false;
    this.dialogNew = false;
  }

  refresh() {
    this.sub.unsubscribe();
    this.ngOnInit();
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

  selectColorType(it: any): object {
    return { 'background-color': it.type.backgroundColor, color: it.type.textColor };
  }

  selectColorWithType(it: any): object {
    return { 'background-color': it.backgroundColor, color: it.textColor };
  }

  getInitials(user: any): string {
    return '' + user.firstname.charAt(0) + '' + user.lastname.charAt(0);
  }

  sprintName(task: TaskEntity) {
    if (task.sprint?.label) {
      return '' + task.sprint.label;
    }
    return 'not assigned';
  }

  setColorWithStatusForSprint(task: TaskEntity): any {
    if (!task.sprint?.label) {
      return { 'background-color': '#6fa8dc', color: '#ffffff' };
    }
    return;
  }
}
