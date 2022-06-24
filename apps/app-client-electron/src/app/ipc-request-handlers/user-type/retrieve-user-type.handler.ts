import { Application, DatabasesService, dependencies } from '@libraries/lib-electron';
import { IpcRequestHandlerInterface } from '@libraries/lib-electron-web';
import { appIpcs, UserType } from '@libraries/lib-scrum-toolbox';
import { FindConditions } from 'typeorm';

export class RetrieveUserTypeHandler implements IpcRequestHandlerInterface {
  channel = appIpcs.retrieveUserType;

  async handle(options: FindConditions<UserType>): Promise<UserType> {
    return Application.getInstance()
      .dependencies.get<DatabasesService>(dependencies.databases)
      .getConnection('main')
      .getRepository<UserType>(UserType)
      .findOne(options);
  }
}
