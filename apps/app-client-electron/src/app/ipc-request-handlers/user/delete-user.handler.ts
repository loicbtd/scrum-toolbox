import { Application, DatabasesService, dependencies } from '@libraries/lib-electron';
import { IpcRequestHandlerInterface } from '@libraries/lib-electron-web';
import { appIpcs, User } from '@libraries/lib-scrum-toolbox';

export class DeleteUserHandler implements IpcRequestHandlerInterface {
  channel = appIpcs.deleteUser;

  async handle(id: string) {
    await Application.getInstance()
      .dependencies.get<DatabasesService>(dependencies.databases)
      .getDataSource('main')
      .getRepository<User>(User)
      .delete({ id: id });
  }
}
