import { Application, DatabasesService, dependencies } from '@libraries/lib-electron';
import { IpcRequestHandlerInterface } from '@libraries/lib-electron-web';
import { appIpcs, TaskStatus } from '@libraries/lib-scrum-toolbox';

export class DeleteTaskStatusHandler implements IpcRequestHandlerInterface {
  channel = appIpcs.deleteTaskStatus;

  async handle(id: string): Promise<void> {
    await Application.getInstance()
      .dependencies.get<DatabasesService>(dependencies.databases)
      .getDataSource('main')
      .getRepository<TaskStatus>(TaskStatus)
      .delete(id);
  }
}
