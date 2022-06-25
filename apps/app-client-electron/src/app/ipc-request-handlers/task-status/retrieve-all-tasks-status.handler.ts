import { Application, DatabasesService, dependencies } from '@libraries/lib-electron';
import { IpcRequestHandlerInterface } from '@libraries/lib-electron-web';
import { appIpcs, TaskStatusEntity } from '@libraries/lib-scrum-toolbox';

export class RetrieveAllTaskStatusHandler implements IpcRequestHandlerInterface {
  channel = appIpcs.retrieveAllTasksStatus;

  async handle(): Promise<TaskStatusEntity[]> {
    return Application.getInstance()
      .dependencies.get<DatabasesService>(dependencies.databases)
      .getConnection('main')
      .getRepository<TaskStatusEntity>(TaskStatusEntity)
      .find();
  }
}
