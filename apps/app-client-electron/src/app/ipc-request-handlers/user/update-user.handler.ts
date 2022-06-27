import { Application, DatabasesService, dependencies } from '@libraries/lib-electron';
import { IpcRequestHandlerInterface } from '@libraries/lib-electron-web';
import { appIpcs, UserEntity, UserModel } from '@libraries/lib-scrum-toolbox';

export class UpdateUserHandler implements IpcRequestHandlerInterface {
  channel = appIpcs.updateUser;

  async handle(user: UserEntity): Promise<UserModel> {
    await Application.getInstance()
      .dependencies.get<DatabasesService>(dependencies.databases)
      .getConnection('main')
      .getRepository<UserEntity>(UserEntity)
      .save(user);
    return {
      id: user.id,
      username: user.username,
      firstname: user.firstname,
      lastname: user.lastname,
      createdAt: user.createdAt,
      isActivated: user.isActivated,
    };
  }
}
