import { IpcChannels } from '@libraries/lib-common';
import { IpcRequestHandlerInterface } from '@libraries/lib-electron-web';
import { User } from '@liraries/lib-scrum-toolbox';
import { UserService } from '../../services/user.service';

export class UpdateUserHandler implements IpcRequestHandlerInterface {
  channel = IpcChannels.custom.user.update;

  handle(data: User) {
    new UserService().update(data);
  }
}
