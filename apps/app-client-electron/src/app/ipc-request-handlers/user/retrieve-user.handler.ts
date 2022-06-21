import { Application, DatabasesService, dependencies } from '@libraries/lib-electron';
import { IpcRequestHandlerInterface } from '@libraries/lib-electron-web';
import { appIpcs, errorsName, User } from '@libraries/lib-scrum-toolbox';
import { EntityNotFoundError, FindConditions } from 'typeorm';

export class RetrieveUserHandler implements IpcRequestHandlerInterface {
  channel = appIpcs.retrieveUser;

  async handle(options: FindConditions<User>): Promise<User> {
    try {
      return await Application.getInstance()
        .dependencies.get<DatabasesService>(dependencies.databases)
        .getConnection('main')
        .getRepository<User>(User)
        .findOneOrFail(options);
    } catch (error: any) {
      if (error instanceof EntityNotFoundError) {
        throw new Error(errorsName.userNotFound);
      }
      throw error;
    }
  }
}
