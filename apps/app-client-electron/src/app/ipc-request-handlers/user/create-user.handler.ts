import { Application, DatabasesService, dependencies } from '@libraries/lib-electron';
import { IpcRequestHandlerInterface } from '@libraries/lib-electron-web';
import { appIpcs, errorsName, UserEntity, UserModel } from '@libraries/lib-scrum-toolbox';
import * as bcrypt from 'bcrypt';
import { QueryFailedError } from 'typeorm';

export class CreateUserHandler implements IpcRequestHandlerInterface {
  channel = appIpcs.createUser;

  async handle(user: UserEntity): Promise<UserModel> {
    try {
      user.password = await bcrypt.hash(user.password, 10);

      await Application.getInstance()
        .dependencies.get<DatabasesService>(dependencies.databases)
        .getConnection('main')
        .getRepository<UserEntity>(UserEntity)
        .insert(user);
      return {
        id: user.id,
        username: user.username,
        firstname: user.firstname,
        lastname: user.lastname,
        createdAt: user.createdAt,
        isActivated: user.isActivated,
      };
    } catch (error: any) {
      if (error instanceof QueryFailedError) {
        throw new Error(errorsName.usernameAlreadyExists);
      }

      throw error;
    }
  }
}
