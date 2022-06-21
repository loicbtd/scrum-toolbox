import { Component } from '@angular/core';
import { CurrentProjectState, ToastMessageService } from '@libraries/lib-angular';
import { appIpcs, Project, Sprint, Task, TaskStatus, TaskType, User, UserUserTypeProject } from '@libraries/lib-scrum-toolbox';
import { IpcService } from '../../../../global/services/ipc.service';
import { ConfirmationService } from 'primeng/api';
import { Select } from '@ngxs/store';
import { CurrentProjectModel } from '../../../../global/models/current-project.model';
import { Observable } from 'rxjs';

@Component({
  templateUrl: './crud-backlog-sprint.component.html',
  styleUrls: ['./crud-backlog-sprint.component.scss'],
})
export class CrudBacklogSprintComponent {
  @Select(CurrentProjectState) currentProject$: Observable<CurrentProjectModel>;

  dialogUpdate: boolean;

  dialogNew: boolean;

  sprints: Sprint[];

  selectedSprint: Sprint;

  items: Task[];

  item: Task;

  selectedItems: Task[];

  submitted: boolean;

  taskStatus: TaskStatus[];
  selectedStatus: TaskStatus | undefined;

  taskType: TaskType[];
  selectedType: TaskType | undefined;;

  selectedUsers: User[];
  filteredUsers: User[];

  selectedProject: Project;

  selectedTasks: Task[];
  filteredTasks: Task[];

  get isCreationMode() {
    return !this.item.id;
  }

  constructor(
    private readonly _toastMessageService: ToastMessageService,
    private readonly _confirmationService: ConfirmationService,
    private readonly _ipcService: IpcService
  ) {}

  async ngOnInit() {
    
    this.taskStatus = await this._ipcService.query<TaskStatus[]>(appIpcs.retrieveAllTasksStatus);
    this.selectedStatus = this.taskStatus[0];

    this.taskType = await this._ipcService.query<TaskType[]>(appIpcs.retrieveAllTasksType);
    this.selectedType = this.taskType[0];

    this.currentProject$.subscribe(async (data: CurrentProjectModel) => {
      if (data) {
        this.selectedProject = data.project;

        this.sprints = await this._ipcService.query<Sprint[]>(appIpcs.retrieveAllSprintsByProject, {
          id: this.selectedProject.id,
        });

        this.selectedSprint = this.sprints[0];
        
        this.updateTasks(this.selectedSprint);
     
      }
    });
  }

  openNew() {
    this.filterTasks();
    const tempStatus = this.item.status as TaskStatus;
    const tempType = this.item.type as TaskType;
    this.item = { status: tempStatus, type: tempType };
    this.submitted = false;
    this.dialogNew = true;
  }

  deleteSelectedItems() {
    this._confirmationService.confirm({
      message: 'Are you sure you want to delete from the sprint the selected items?',
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

  initDialogFieldsUpdate(item: Task) {
    this.selectedStatus = item.status;
    this.selectedType = item.type;
    this.filterUsers(item);
  }

  editItem(item: Task) {
    this.initDialogFieldsUpdate(item);
    this.item = { ...item };
    this.dialogUpdate = true;
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
          this.item = { status: tempStatus, type: tempType };
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
      
      console.log(this.item);

      try {
        await this._ipcService.query(appIpcs.updateTask, this.item);
        this.items[this.findIndexById(this.item.id)] = this.item;
        this._toastMessageService.showSuccess('Item Updated', 'Successful');
      } catch (error: any) {
        this._toastMessageService.showError(error.message, `Error while updating item`);
      }
    } else {
      try {
        this.selectedSprint.tasks = this.selectedTasks.concat(this.items);
        console.log(this.selectedSprint);
        await this._ipcService.query<Sprint>(appIpcs.updateSprint, this.selectedSprint.id);

        this._toastMessageService.showSuccess('Item Created', 'Successful');
        this.resetDialogNew();
      } catch (error: any) {
        this.resetDialogNew();
        this.hideDialog();
        this._toastMessageService.showError(error.message, `Error while creating item`);
      }
    }

    this.items = [...this.items];
    this.dialogUpdate = false;
    const tempStatus = this.item.status as TaskStatus;
    const tempType = this.item.type as TaskType;
    this.item = { status: tempStatus, type: tempType };
  }

  resetDialogNew() {
    this.selectedTasks = [];
    this.selectedStatus = this.taskStatus.find((el) => el.label === 'TODO');
    this.selectedType = this.taskType.find((el) => el.label === 'Bug');
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

  async updateTasks(sprint: Sprint) {
    this.selectedSprint = sprint;
    this.items = await this._ipcService.query<Task[]>(appIpcs.retrieveAllTasksBySprint, this.selectedSprint.id);
    this.item = this.items[0];
  }

  convertUserUserTypeProjectIntoUsers(usersTypeProject: UserUserTypeProject[]): User[] {
    const result: User[] = [];

    usersTypeProject.forEach(el => {
      if (el.user) {
        result.push(el.user);
      }
    });

    return result;
  }

  async filterUsers(task: Task) {

    const usersProject: UserUserTypeProject[] = await this._ipcService.query<UserUserTypeProject[]>(appIpcs.retrieveAllUsersInProject, this.selectedProject.id);

    if (task.users?.length == 0) {
      this.filteredUsers = this.convertUserUserTypeProjectIntoUsers(usersProject);
      return;
    }

    this.selectedUsers = task.users || [];
    

    this.filteredUsers = this.convertUserUserTypeProjectIntoUsers(usersProject.filter((userFromProject) => {
      return this.selectedUsers.every((filter) => {
        return filter.username !== userFromProject.user?.username && filter.id !== userFromProject.user?.id;
      });
    }));

    

  }

  async filterTasks() {

    const tasksProject: Task[] = await this._ipcService.query<Task[]>(appIpcs.retrieveAllTasksByProject, this.selectedProject.id);
    console.log(tasksProject);
    
    const tasksSprint: Task[] = await this._ipcService.query<Task[]>(appIpcs.retrieveAllTasksBySprint, this.selectedSprint.id);

    if (tasksSprint.length == 0) {
      this.filteredTasks = tasksProject;
      return;
    }
    
    this.filteredTasks = tasksProject.filter((tasksFromProject) => {
      return tasksSprint.every((filter) => {
        return filter.label !== tasksFromProject.label && filter.id !== tasksFromProject.id;
      });
    });  

  }
}
