import { Application, DatabasesService, dependencies } from '@libraries/lib-electron';
import { IpcRequestHandlerInterface } from '@libraries/lib-electron-web';
import { appIpcs, errorsName, User } from '@libraries/lib-scrum-toolbox';
import * as bcrypt from 'bcrypt';
import { EntityNotFoundError } from 'typeorm';

export class LoginHandler implements IpcRequestHandlerInterface {
  channel = appIpcs.login;

  async handle(data: { login: string; password: string }): Promise<User> {
    let user: User;
    try {
      user = await Application.getInstance()
        .dependencies.get<DatabasesService>(dependencies.databases)
        .getDataSource('main')
        .getRepository<User>(User)
        .findOneByOrFail({ username: data.login });
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
