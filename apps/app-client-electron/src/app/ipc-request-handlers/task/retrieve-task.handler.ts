import { Application, DatabasesService, dependencies } from '@libraries/lib-electron';
import { IpcRequestHandlerInterface } from '@libraries/lib-electron-web';
import { appIpcs, TaskEntity } from '@libraries/lib-scrum-toolbox';
import { FindConditions } from 'typeorm';

export class RetrieveTaskHandler implements IpcRequestHandlerInterface {
  channel = appIpcs.retrieveTask;

  async handle(options: FindConditions<TaskEntity>): Promise<TaskEntity> {
    return Application.getInstance()
      .dependencies.get<DatabasesService>(dependencies.databases)
      .getConnection('main')
      .getRepository<TaskEntity>(TaskEntity)
      .findOne(options);
  }
}
