import { IpcRequestHandlerInterface } from '@libraries/lib-electron-web';
import { appIpcs, User } from '@libraries/lib-scrum-toolbox';
import { inject, injectable } from 'inversify';
import { UsersService } from '../../services/users.service';

@injectable()
export class CreateUserHandler implements IpcRequestHandlerInterface {
  constructor(@inject(UsersService.constructor.name) private readonly _usersService: UsersService) {}

  channel = appIpcs.createUser;

  async handle(user: User) {
    return await this._usersService.create(user);
  }
}
