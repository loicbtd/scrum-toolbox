import { Application, DatabasesService, dependencies } from '@libraries/lib-electron';
import { IpcRequestHandlerInterface } from '@libraries/lib-electron-web';
import { appIpcs, errorsName, User } from '@libraries/lib-scrum-toolbox';
import * as bcrypt from 'bcrypt';

export class LoginHandler implements IpcRequestHandlerInterface {
  channel = appIpcs.login;

  async handle(data: { login: string; password: string }): Promise<User> {
    try {
      const user = await Application.getInstance()
        .dependencies.get<DatabasesService>(dependencies.databases)
        .getDataSource('main')
        .getRepository<User>(User)
        .findOneByOrFail({ username: data.login });
      if (await bcrypt.compare(data.password, user.password)) {
        return user;
      } else {
        throw new Error(errorsName.incorrectPassword);
      }
    } catch (err) {
      throw new Error(errorsName.incorrectUsername);
    }
  }
}
