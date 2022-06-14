import { Application, DatabasesService, dependencies } from '@libraries/lib-electron';
import { IpcRequestHandlerInterface } from '@libraries/lib-electron-web';
import { appIpcs, User } from '@libraries/lib-scrum-toolbox';

export class UpdateUserHandler implements IpcRequestHandlerInterface {
  channel = appIpcs.updateUser;

  async handle(user: User) {
    await Application.getInstance()
      .dependencies.get<DatabasesService>(dependencies.databases)
      .getDataSource('main')
      .getRepository<User>(User)
      .update(user, { id: user.id });
  }
}
