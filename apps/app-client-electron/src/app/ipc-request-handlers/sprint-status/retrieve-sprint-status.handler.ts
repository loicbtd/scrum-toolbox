import { Application, DatabasesService, dependencies } from '@libraries/lib-electron';
import { IpcRequestHandlerInterface } from '@libraries/lib-electron-web';
import { appIpcs, SprintStatus } from '@libraries/lib-scrum-toolbox';
import { FindConditions } from 'typeorm';

export class RetrieveSprintStatusHandler implements IpcRequestHandlerInterface {
  channel = appIpcs.retrieveSprintStatus;

  async handle(options: FindConditions<SprintStatus>): Promise<SprintStatus> {
    return Application.getInstance()
      .dependencies.get<DatabasesService>(dependencies.databases)
      .getConnection('main')
      .getRepository<SprintStatus>(SprintStatus)
      .findOne(options);
  }
}
