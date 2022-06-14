import { Application, DatabasesService, dependencies } from '@libraries/lib-electron';
import { IpcRequestHandlerInterface } from '@libraries/lib-electron-web';
import { appIpcs, TaskStatus } from '@libraries/lib-scrum-toolbox';

export class RetrieveAllTaskStatussHandler implements IpcRequestHandlerInterface {
  channel = appIpcs.retrieveAllTasksStatus;

  async handle(): Promise<TaskStatus[]> {
    return Application.getInstance()
      .dependencies.get<DatabasesService>(dependencies.databases)
      .getDataSource('main')
      .getRepository<TaskStatus>(TaskStatus)
      .find();
  }
}
