import { Application, DatabasesService, dependencies } from '@libraries/lib-electron';
import { IpcRequestHandlerInterface } from '@libraries/lib-electron-web';
import { appIpcs, TaskType } from '@libraries/lib-scrum-toolbox';
import { FindConditions } from 'typeorm';

export class RetrieveTaskTypeHandler implements IpcRequestHandlerInterface {
  channel = appIpcs.retrieveTaskType;

  async handle(options: FindConditions<TaskType>): Promise<TaskType> {
    return Application.getInstance()
      .dependencies.get<DatabasesService>(dependencies.databases)
      .getConnection('main')
      .getRepository<TaskType>(TaskType)
      .findOne(options);
  }
}
