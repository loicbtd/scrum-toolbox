import { Application, DatabasesService, dependencies } from '@libraries/lib-electron';
import { IpcRequestHandlerInterface } from '@libraries/lib-electron-web';
import { appIpcs, errorsName, UserEntity } from '@libraries/lib-scrum-toolbox';
import * as bcrypt from 'bcrypt';
import { EntityNotFoundError } from 'typeorm';

export class LoginHandler implements IpcRequestHandlerInterface {
  channel = appIpcs.login;

  async handle(data: { login: string; password: string }): Promise<UserEntity> {
    let user: UserEntity;
    try {
      user = await Application.getInstance()
        .dependencies.get<DatabasesService>(dependencies.databases)
        .getConnection('main')
        .getRepository<UserEntity>(UserEntity)
        .findOneOrFail({ username: data.login });
    } catch (error: any) {
      if (error instanceof EntityNotFoundError) {
        throw new Error(errorsName.incorrectUsername);
      } else {
        throw error;
      }
    }
    if (!user.isActivated) {
      throw new Error(errorsName.userNotActivated);
    }
    if (await bcrypt.compare(data.password, user.password)) {
      return user;
    } else {
      throw new Error(errorsName.incorrectPassword);
    }
  }
}
