import { Component } from '@angular/core';
import { ToastMessageService } from '@libraries/lib-angular';
import { appIpcs, Sprint, Task, TaskStatus, TaskType, User } from '@libraries/lib-scrum-toolbox';
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

  taskStatus: TaskStatus[];
  selectedStatus: TaskStatus;
  
  taskType: TaskType[];
  selectedType: TaskType;

  selectedUsers: User[];
  filteredUsers: User[];

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
    // this.sprints = await this._ipcService.query<Sprint[]>(appIpcs.retrieveAllSprintsByProject, {
      // projectId: projectFromDropdwon.id,
    // });
    this.sprints = await this._ipcService.query<Sprint[]>(appIpcs.retrieveAllSprints);
    this.selectedSprint = this.sprints[0];

    //TODO retrieve all task from selectedSprint
    this.items = await this._ipcService.query<Task[]>(appIpcs.retrieveAllTasks);
    this.item = this.items[0];

    this.taskStatus = await this._ipcService.query<TaskStatus[]>(appIpcs.retrieveAllTasksStatus);
    console.log(this.taskStatus);
    
    this.selectedStatus = this.taskStatus[0];
    this.taskType = await this._ipcService.query<TaskType[]>(appIpcs.retrieveAllTasksType);
    this.selectedType = this.taskType[0];

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
    return {"background-color": it.status.backgroundColor, "color": it.status.textColor};
  }
  selectColorWithStatus(it: any): object {
    return {"background-color": it.backgroundColor, "color": it.textColor};
  }

  selectColorType(it: any): object {
    return {"background-color": it.type.backgroundColor, "color": it.type.textColor};
  }
  selectColorWithType(it: any): object {
    return {"background-color": it.backgroundColor, "color": it.textColor};
  }

  getInitials(user: any): string {
    console.log(user);
    
    console.log("" + user.firstname.charAt(0) + "" + user.lastname.charAt(0));
    
    return "" + user.firstname.charAt(0) + "" + user.lastname.charAt(0);
  }

  updateTasks() {
    //TODO update tasks in sprint backlog view
    // this.items = await this._ipcService.query<Task[]>(appIpcs.retrieveAllTasks);
    // this.item = this.items[0];
  }

  getStatus(blop: any): TaskStatus[] {
    return this.taskStatus;
  }

  getTypes(blop: any): TaskType[] {
    return this.taskType;
  }

  updateStatus() {
    console.log("here");
    
    return;
  }

  updateType() {
    console.log("here2");
    
    return;
  }

  filterUsers(event) {
    let filtered : any[] = [];

    

    for(let i = 0; i < this.countries.length; i++) {
        let country = this.countries[i];
        if (country.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
            filtered.push(country);
        }
    }

    this.filteredUsers = filtered;
  }

}
