import { Application, DatabasesService, dependencies } from '@libraries/lib-electron';
import { IpcRequestHandlerInterface } from '@libraries/lib-electron-web';
import { appIpcs, SprintStatusEntity } from '@libraries/lib-scrum-toolbox';
import { FindConditions } from 'typeorm';

export class RetrieveSprintStatusHandler implements IpcRequestHandlerInterface {
  channel = appIpcs.retrieveSprintStatus;

  async handle(options: FindConditions<SprintStatusEntity>): Promise<SprintStatusEntity> {
    return Application.getInstance()
      .dependencies.get<DatabasesService>(dependencies.databases)
      .getConnection('main')
      .getRepository<SprintStatusEntity>(SprintStatusEntity)
      .findOne(options);
  }
}
