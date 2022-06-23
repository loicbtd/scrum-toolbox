import { Application, DatabasesService, dependencies } from '@libraries/lib-electron';
import { IpcRequestHandlerInterface } from '@libraries/lib-electron-web';
import { appIpcs, TaskStatus } from '@libraries/lib-scrum-toolbox';
import { FindConditions } from 'typeorm';

export class RetrieveTaskStatusHandler implements IpcRequestHandlerInterface {
  channel = appIpcs.retrieveTaskStatus;

  async handle(options: FindConditions<TaskStatus>): Promise<TaskStatus> {
    return Application.getInstance()
      .dependencies.get<DatabasesService>(dependencies.databases)
      .getConnection('main')
      .getRepository<TaskStatus>(TaskStatus)
      .findOne(options);
  }
}
