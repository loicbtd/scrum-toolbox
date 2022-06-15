import { Application, DatabasesService, dependencies } from '@libraries/lib-electron';
import { IpcRequestHandlerInterface } from '@libraries/lib-electron-web';
import { appIpcs, User } from '@libraries/lib-scrum-toolbox';
import * as bcrypt from 'bcrypt';

export class CreateUserHandler implements IpcRequestHandlerInterface {
  channel = appIpcs.createUser;

  async handle(user: User): Promise<User> {
    user.password = await bcrypt.hash(user.password, 10);
    await Application.getInstance()
      .dependencies.get<DatabasesService>(dependencies.databases)
      .getDataSource('main')
      .getRepository<User>(User)
      .insert(user);
    return user;
  }
}