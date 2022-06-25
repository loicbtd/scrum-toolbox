import { Application, DatabasesService, dependencies } from '@libraries/lib-electron';
import { IpcRequestHandlerInterface } from '@libraries/lib-electron-web';
import { appIpcs, TaskStatusEntity } from '@libraries/lib-scrum-toolbox';
import { FindConditions } from 'typeorm';

export class RetrieveTaskStatusHandler implements IpcRequestHandlerInterface {
  channel = appIpcs.retrieveTaskStatus;

  async handle(options: FindConditions<TaskStatusEntity>): Promise<TaskStatusEntity> {
    return Application.getInstance()
      .dependencies.get<DatabasesService>(dependencies.databases)
      .getConnection('main')
      .getRepository<TaskStatusEntity>(TaskStatusEntity)
      .findOne(options);
  }
}
