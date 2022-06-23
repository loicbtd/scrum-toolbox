import { Component } from '@angular/core';
import { CurrentProjectState, MyProfileState, ToastMessageService } from '@libraries/lib-angular';
import { appIpcs, Project, Task, TaskStatus, TaskType, UserModel } from '@libraries/lib-scrum-toolbox';
import { IpcService } from '../../../../global/services/ipc.service';
import { ConfirmationService } from 'primeng/api';
import { Select, Store } from '@ngxs/store';
import { MyProfileModel } from '../../../../global/models/my-profile.model';
import { Observable, Subscription } from 'rxjs';
import { CurrentProjectModel } from '../../../../global/models/current-project.model';

@Component({
  templateUrl: './crud-product-backlog.component.html',
  styleUrls: ['./crud-product-backlog.component.scss'],
})
export class CrudProductBacklogComponent {
  @Select(CurrentProjectState) currentProject$: Observable<CurrentProjectModel>;

  dialogUpdate: boolean;
  dialogNew: boolean;

  items: Task[];

  item: Task;

  selectedItems: Task[];

  submitted: boolean;
  
  selectedProject: Project;
  
  tasks: Task[];

  taskType: TaskType[];
  selectedType: TaskType;

  sub: Subscription;

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

    this.taskType = await this._ipcService.query<TaskType[]>(appIpcs.retrieveAllTasksType);
    this.selectedType = this.taskType[0];
    
    this.sub = this.currentProject$.subscribe(async (data: CurrentProjectModel) => {
      if (data) {
        
        this.selectedProject = data.project;

        this.items = await this._ipcService.query<Task[]>(appIpcs.retrieveAllTasksByProject, this.selectedProject.id);
        this.item = this.items[0];

      }
    });
    
  }

  openNew() {
    const tempStatus = this.item?.status as TaskStatus;
    const tempType = this.item?.type as TaskType;
    this.item = { status: tempStatus, type: tempType };
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

  editItem(item: Task) {
    this.item = { ...item };
    this.dialogUpdate = true;
  }

  async deleteItem(item: Task) {
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
          // this.item = {};
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
        await this._ipcService.query(appIpcs.updateUser, this.item);
        this.items[this.findIndexById(this.item.id)] = this.item;
        this._toastMessageService.showSuccess('Item Updated', 'Successful');
      } catch (error: any) {
        this._toastMessageService.showError(error.message, `Error while updating item`);
      }
    } else {
      try {
        // this.item = await this._ipcService.query<UserModel>(appIpcs.createUser, this.item);
        // this.items.push(this.item);
        this._toastMessageService.showSuccess('Item Created', 'Successful');
      } catch (error: any) {
        this._toastMessageService.showError(error.message, `Error while creating item`);
      }
    }

    this.items = [...this.items];
    this.dialogUpdate = false;
    this.dialogNew = false;
    // this.item = {};
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

  sprintName(task: Task) {
    if (task.sprint?.label) {
      return '' + task.sprint.label;
    }
    return 'not assigned';
  }

  setColorWithStatus(task: Task): any {
    if (!task.sprint?.label) {
      return { 'background-color': '#6fa8dc', color: '#ffffff' };
    }
    return;
  }

}
