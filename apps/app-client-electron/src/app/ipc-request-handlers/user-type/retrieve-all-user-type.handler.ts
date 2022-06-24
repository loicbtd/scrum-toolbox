import { Application, DatabasesService, dependencies } from '@libraries/lib-electron';
import { IpcRequestHandlerInterface } from '@libraries/lib-electron-web';
import { appIpcs, UserType } from '@libraries/lib-scrum-toolbox';

export class RetrieveAllUserTypesHandler implements IpcRequestHandlerInterface {
  channel = appIpcs.retrieveAllUsersType;

  async handle(): Promise<UserType[]> {
    return Application.getInstance()
      .dependencies.get<DatabasesService>(dependencies.databases)
      .getConnection('main')
      .getRepository<UserType>(UserType)
      .find();
  }
}
