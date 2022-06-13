import { Component } from '@angular/core';
import { appIpcs, User } from '@libraries/lib-scrum-toolbox';
import { IpcService } from '../../../../global/services/ipc.service';

@Component({
  selector: 'app-webservice-test',
  templateUrl: './webservice-test.component.html',
})
export class WebserviceTestComponent {
  currentUser!: User;

  constructor(private readonly _ipcService: IpcService) {}

  async createUser() {
    const u = new User();
    u.username = 'titi';
    u.firstname = 'Toto';
    u.lastname = 'TITI';
    u.password = 'MYPASSWORD';
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
    await this._ipcService.query(appIpcs.retrieveAllUsers);
  }

  async retrieveUser() {
    await this._ipcService.query(appIpcs.retrieveUser, { id: this.currentUser.id });
  }

  async activateUser() {
    await this._ipcService.query(appIpcs.updateStatusUser, { id: this.currentUser.id, isActivated: true });
  }

  async deactivateUser() {
    await this._ipcService.query(appIpcs.updateStatusUser, { id: this.currentUser.id, isActivated: false });
  }

  async login() {
    await this._ipcService.query(appIpcs.login, {
      login: 'titi',
      password: 'MYPASSWORD',
    });
  }
}
