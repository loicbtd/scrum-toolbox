import { Application, DatabasesService, dependencies } from '@libraries/lib-electron';
import { IpcRequestHandlerInterface } from '@libraries/lib-electron-web';
import { appIpcs, User } from '@libraries/lib-scrum-toolbox';

export class RetrieveAllUsersHandler implements IpcRequestHandlerInterface {
  channel = appIpcs.retrieveAllUsers;

  async handle(): Promise<User[]> {
    return await Application.getInstance()
      .dependencies.get<DatabasesService>(dependencies.databases)
      .getConnection('main')
      .getRepository<User>(User)
      .find();
  }
}
