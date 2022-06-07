import { IpcChannels } from '@libraries/lib-common';
import { IpcRequestHandlerInterface } from '@libraries/lib-electron-web';
import { User } from '@liraries/lib-scrum-toolbox';
import { UserService } from '../../services/user.service';

export class DeleteUserHandler implements IpcRequestHandlerInterface {
  channel = IpcChannels.custom.user.delete;

  handle(data: User) {
    new UserService().delete(data);
  }
}
