import { Application, DatabasesService, dependencies } from '@libraries/lib-electron';
import { IpcRequestHandlerInterface } from '@libraries/lib-electron-web';
import { appIpcs, TaskTypeEntity } from '@libraries/lib-scrum-toolbox';
import { FindConditions } from 'typeorm';

export class RetrieveTaskTypeHandler implements IpcRequestHandlerInterface {
  channel = appIpcs.retrieveTaskType;

  async handle(options: FindConditions<TaskTypeEntity>): Promise<TaskTypeEntity> {
    return Application.getInstance()
      .dependencies.get<DatabasesService>(dependencies.databases)
      .getConnection('main')
      .getRepository<TaskTypeEntity>(TaskTypeEntity)
      .findOne(options);
  }
}
