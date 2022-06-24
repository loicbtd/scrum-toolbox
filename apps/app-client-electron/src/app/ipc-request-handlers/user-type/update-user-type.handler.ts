import { Application, DatabasesService, dependencies } from '@libraries/lib-electron';
import { IpcRequestHandlerInterface } from '@libraries/lib-electron-web';
import { appIpcs, UserType } from '@libraries/lib-scrum-toolbox';

export class UpdateUserTypeHandler implements IpcRequestHandlerInterface {
  channel = appIpcs.updateUserType;

  async handle(userType: UserType): Promise<UserType> {
    await Application.getInstance()
      .dependencies.get<DatabasesService>(dependencies.databases)
      .getConnection('main')
      .getRepository<UserType>(UserType)
      .save(userType);
    return userType;
  }
}
