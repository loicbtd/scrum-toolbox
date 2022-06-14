import { Application, DatabasesService, dependencies } from '@libraries/lib-electron';
import { IpcRequestHandlerInterface } from '@libraries/lib-electron-web';
import { appIpcs, User } from '@libraries/lib-scrum-toolbox';

export class CreateUserHandler implements IpcRequestHandlerInterface {
  channel = appIpcs.createUser;

  async handle(user: User) {
    return (
      await Application.getInstance()
        .dependencies.get<DatabasesService>(dependencies.databases)
        .getDataSource('main')
        .getRepository<User>(User)
        .insert(user)
    ).generatedMaps[0];
  }
}
