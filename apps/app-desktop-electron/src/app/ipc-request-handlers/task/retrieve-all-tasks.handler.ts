import { Application, DatabasesService, dependencies } from '@libraries/lib-electron';
import { IpcRequestHandlerInterface } from '@libraries/lib-electron-web';
import { appIpcs, Task } from '@libraries/lib-scrum-toolbox';

export class RetrieveAllTasksHandler implements IpcRequestHandlerInterface {
  channel = appIpcs.retrieveAllTasks;

  async handle(): Promise<Task[]> {
    return Application.getInstance()
      .dependencies.get<DatabasesService>(dependencies.databases)
      .getDataSource('main')
      .getRepository<Task>(Task)
      .find();
  }
}
