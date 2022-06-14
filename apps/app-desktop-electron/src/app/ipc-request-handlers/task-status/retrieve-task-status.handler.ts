import { Application, DatabasesService, dependencies } from '@libraries/lib-electron';
import { IpcRequestHandlerInterface } from '@libraries/lib-electron-web';
import { appIpcs, TaskStatus } from '@libraries/lib-scrum-toolbox';
import { FindOptionsWhere } from 'typeorm';

export class RetrieveTaskStatusHandler implements IpcRequestHandlerInterface {
  channel = appIpcs.retrieveTaskStatus;

  async handle(options: FindOptionsWhere<TaskStatus>): Promise<TaskStatus> {
    return Application.getInstance()
      .dependencies.get<DatabasesService>(dependencies.databases)
      .getDataSource('main')
      .getRepository<TaskStatus>(TaskStatus)
      .findOneBy(options);
  }
}
