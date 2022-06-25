import { Application, DatabasesService, dependencies } from '@libraries/lib-electron';
import { IpcRequestHandlerInterface } from '@libraries/lib-electron-web';
import { appIpcs, SprintEntity } from '@libraries/lib-scrum-toolbox';
import { FindConditions } from 'typeorm';

export class RetrieveSprintHandler implements IpcRequestHandlerInterface {
  channel = appIpcs.retrieveSprint;

  async handle(options: FindConditions<SprintEntity>): Promise<SprintEntity> {
    return Application.getInstance()
      .dependencies.get<DatabasesService>(dependencies.databases)
      .getConnection('main')
      .getRepository<SprintEntity>(SprintEntity)
      .findOne(options);
  }
}
