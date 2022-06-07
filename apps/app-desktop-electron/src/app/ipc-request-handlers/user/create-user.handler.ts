import { IpcChannels } from '@libraries/lib-common';
import { IpcRequestHandlerInterface } from '@libraries/lib-electron-web';
import { User } from '@liraries/lib-scrum-toolbox';
import { UserService } from '../../services/user.service';

export class CreateUserHandler implements IpcRequestHandlerInterface {
  channel = IpcChannels.custom.user.create;

  handle(data: User) {
    new UserService().create(data);
  }
}
