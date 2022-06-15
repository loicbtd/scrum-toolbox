import { Application, DatabasesService, dependencies } from '@libraries/lib-electron';
import { IpcRequestHandlerInterface } from '@libraries/lib-electron-web';
import { appIpcs, errorsName, User } from '@libraries/lib-scrum-toolbox';
import { EntityNotFoundError, FindOptionsWhere } from 'typeorm';

export class RetrieveUserHandler implements IpcRequestHandlerInterface {
  channel = appIpcs.retrieveUser;

  async handle(options: FindOptionsWhere<User>): Promise<User> {
    try {
      return await Application.getInstance()
        .dependencies.get<DatabasesService>(dependencies.databases)
        .getDataSource('main')
        .getRepository<User>(User)
        .findOneByOrFail(options);
    } catch (error: any) {
      if (error instanceof EntityNotFoundError) {
        throw new Error(errorsName.userNotFound);
      }
      throw error;
    }
  }
}
