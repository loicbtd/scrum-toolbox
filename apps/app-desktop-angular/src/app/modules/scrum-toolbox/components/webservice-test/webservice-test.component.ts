import { Component } from '@angular/core';
import { appIpcs, Task, TaskStatus, TaskType, User } from '@libraries/lib-scrum-toolbox';
import { IpcService } from '../../../../global/services/ipc.service';

@Component({
  selector: 'app-webservice-test',
  templateUrl: './webservice-test.component.html',
})
export class WebserviceTestComponent {
  currentUser!: User;

  constructor(private readonly _ipcService: IpcService) {}

  async initBD() {
    let taskType, type, color;
    const types = ['BUG', 'ISSUE'];
    const colors = ['#FF0000', '#0000FF'];
    for (let i = 0; i < types.length; i++) {
      type = types[i];
      color = colors[i];
      taskType = new TaskType();
      taskType.label = type;
      taskType.color = color;
      await this._ipcService.query(appIpcs.createTaskType, taskType);
    }
    let taskStatus;
    const status = ['CREATED', 'IN PROGRESS', 'DONE'];
    for (let i = 0; i < status.length; i++) {
      type = status[i];
      color = colors[i];
      taskStatus = new TaskStatus();
      taskStatus.label = type;
      taskStatus.color = color;
      await this._ipcService.query(appIpcs.createTaskStatus, taskStatus);
    }
  }

  async createUser() {
    const u = new User();
    u.username = 'titi';
    u.firstname = 'Toto';
    u.lastname = 'TITI';
    this.currentUser = await this._ipcService.query(appIpcs.createUser, u);
  }

  updateUser() {
    this._ipcService.query(appIpcs.updateUser, {
      id: this.currentUser.id,
      firstname: 'Tartenpion',
    });
  }
  deleteUser() {
    this._ipcService.query(appIpcs.deleteUser, {
      id: this.currentUser.id,
    });
  }

  async retrieveAllUsers() {
    console.log(await this._ipcService.query(appIpcs.retrieveAllUsers));
  }

  async retrieveUser() {
    console.log(await this._ipcService.query(appIpcs.retrieveUser, { id: this.currentUser.id }));
  }

  async activateUser() {
    await this._ipcService.query(appIpcs.updateStatusUser, { id: this.currentUser.id, isActivated: true });
  }

  async deactivateUser() {
    await this._ipcService.query(appIpcs.updateStatusUser, { id: this.currentUser.id, isActivated: false });
  }

  async login() {
    await this._ipcService.query(appIpcs.login, {});
  }

  async createTask() {
    const taskType = await this.retrieveAllTaskType();
    const taskStatus = await this.retrieveAllTaskStatus();
    const t = new Task();
    t.label = 'ISSUE';
    t.status = taskStatus[Math.floor(Math.random() * taskStatus.length)];
    t.type = taskType[Math.floor(Math.random() * taskType.length)];
    t.description = 'lorem ipsum dolor sit amet, consectetur adipis';
    const task = await this._ipcService.query(appIpcs.createTask, t);
    console.log(task);
  }

  async retrieveAllTaskStatus(): Promise<TaskStatus[]> {
    return this._ipcService.query(appIpcs.retrieveAllTasksStatus);
  }

  async retrieveAllTaskType(): Promise<TaskType[]> {
    return this._ipcService.query(appIpcs.retrieveAllTasksType);
  }

  async retrieveAllTasks() {
    console.log(await this._ipcService.query(appIpcs.retrieveAllTasks));
  }

  async assignTaskToUser() {
    await this._ipcService.query(appIpcs.assignTaskToUser, {
      taskId: 'c365e2e8-ac9f-4239-85d6-2b60e0e2ca36',
      userId: 'ccce153a-fd3c-47cf-8d67-f6da3dfda16e',
    });
  }
  async assignTaskToSprint() {
    await this._ipcService.query(appIpcs.assignTaskToSprint, {
      taskId: 'c365e2e8-ac9f-4239-85d6-2b60e0e2ca36',
      sprintId: '5b93ebb9-ee28-4ac3-af7b-8141178762f9',
    });
  }
}
