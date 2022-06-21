import { Application, DatabasesService, dependencies } from '@libraries/lib-electron';
import { IpcRequestHandlerInterface } from '@libraries/lib-electron-web';
import { EntityNotFoundError, FindConditions } from 'typeorm';
import { appIpcs, errorsName, User, UserModel } from '@libraries/lib-scrum-toolbox';

export class RetrieveUserHandler implements IpcRequestHandlerInterface {
  channel = appIpcs.retrieveUser;

  async handle(options: FindConditions<User>): Promise<UserModel> {
    try {
      const user = await Application.getInstance()
        .dependencies.get<DatabasesService>(dependencies.databases)
        .getConnection('main')
        .getRepository<User>(User)
        .findOneOrFail(options);
      return {
        id: user.id,
        username: user.username,
        firstname: user.firstname,
        lastname: user.lastname,
        createdAt: user.createdAt,
        isActivated: user.isActivated,
      };
    } catch (error: any) {
      if (error instanceof EntityNotFoundError) {
        throw new Error(errorsName.userNotFound);
      }
      throw error;
    }
  }
}
