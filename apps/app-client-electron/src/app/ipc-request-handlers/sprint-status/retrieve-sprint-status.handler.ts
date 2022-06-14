import { Application, DatabasesService, dependencies } from '@libraries/lib-electron';
import { IpcRequestHandlerInterface } from '@libraries/lib-electron-web';
import { appIpcs, SprintStatus } from '@libraries/lib-scrum-toolbox';
import { FindOptionsWhere } from 'typeorm';

export class RetrieveSprintStatusHandler implements IpcRequestHandlerInterface {
  channel = appIpcs.retrieveSprintStatus;

  async handle(options: FindOptionsWhere<SprintStatus>): Promise<SprintStatus> {
    return Application.getInstance()
      .dependencies.get<DatabasesService>(dependencies.databases)
      .getDataSource('main')
      .getRepository<SprintStatus>(SprintStatus)
      .findOneBy(options);
  }
}
