import { Application, DatabasesService, dependencies } from '@libraries/lib-electron';
import { IpcRequestHandlerInterface } from '@libraries/lib-electron-web';
import { appIpcs, UserType } from '@libraries/lib-scrum-toolbox';

export class CreateUserTypeHandler implements IpcRequestHandlerInterface {
  channel = appIpcs.createUserType;

  async handle(userType: UserType): Promise<UserType> {
    await Application.getInstance()
      .dependencies.get<DatabasesService>(dependencies.databases)
      .getConnection('main')
      .getRepository<UserType>(UserType)
      .insert(userType);
    return userType;
  }
}
