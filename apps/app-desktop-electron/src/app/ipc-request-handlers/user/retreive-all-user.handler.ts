import { Injectable } from '@angular/core';
import { IpcChannels, IpcResponseModel, UserIpcResponseModel } from '@libraries/lib-common';
import { IpcRequestHandlerInterface } from '@libraries/lib-electron-web';
import { User } from '@liraries/lib-scrum-toolbox';
import { UserService } from '../../services/user.service';

@Injectable({ providedIn: 'root' })
export class RetrieveAlllUsersHandler implements IpcRequestHandlerInterface {
  constructor(private readonly userService: UserService) {}
  channel = IpcChannels.custom.user.retrieveAll;

  handle(_) {
    this.userService.retrieveAll().then((users: User[]) => {
      return users;
    });
    // const response = new UserIpcResponseModel();
    // response.data
  }
}
