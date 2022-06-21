import { Application, DatabasesService, dependencies } from '@libraries/lib-electron';
import { IpcRequestHandlerInterface } from '@libraries/lib-electron-web';
import { appIpcs, errorsName, User, UserModel } from '@libraries/lib-scrum-toolbox';
import { EntityNotFoundError, FindOptionsWhere } from 'typeorm';

export class RetrieveUserHandler implements IpcRequestHandlerInterface {
  channel = appIpcs.retrieveUser;

  async handle(options: FindOptionsWhere<User>): Promise<UserModel> {
    try {
      const user = await Application.getInstance()
        .dependencies.get<DatabasesService>(dependencies.databases)
        .getDataSource('main')
        .getRepository<User>(User)
        .findOneByOrFail(options);
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
