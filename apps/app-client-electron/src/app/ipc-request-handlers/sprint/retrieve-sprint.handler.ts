import { Application, DatabasesService, dependencies } from '@libraries/lib-electron';
import { IpcRequestHandlerInterface } from '@libraries/lib-electron-web';
import { appIpcs, Sprint } from '@libraries/lib-scrum-toolbox';
import { FindConditions } from 'typeorm';

export class RetrieveSprintHandler implements IpcRequestHandlerInterface {
  channel = appIpcs.retrieveSprint;

  async handle(options: FindConditions<Sprint>): Promise<Sprint> {
    return Application.getInstance()
      .dependencies.get<DatabasesService>(dependencies.databases)
      .getConnection('main')
      .getRepository<Sprint>(Sprint)
      .findOne(options);
  }
}
