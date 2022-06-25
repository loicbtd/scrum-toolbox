import { Application, DatabasesService, dependencies } from '@libraries/lib-electron';
import { IpcRequestHandlerInterface } from '@libraries/lib-electron-web';
import { EntityNotFoundError, FindConditions } from 'typeorm';
import { appIpcs, errorsName, UserEntity, UserModel } from '@libraries/lib-scrum-toolbox';

export class RetrieveUserHandler implements IpcRequestHandlerInterface {
  channel = appIpcs.retrieveUser;

  async handle(options: FindConditions<UserEntity>): Promise<UserModel> {
    try {
      const user = await Application.getInstance()
        .dependencies.get<DatabasesService>(dependencies.databases)
        .getConnection('main')
        .getRepository<UserEntity>(UserEntity)
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
