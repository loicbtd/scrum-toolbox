import { Application, DatabasesService, dependencies } from '@libraries/lib-electron';
import { IpcRequestHandlerInterface } from '@libraries/lib-electron-web';
import { appIpcs, TaskType } from '@libraries/lib-scrum-toolbox';

export class DeleteTaskTypeHandler implements IpcRequestHandlerInterface {
  channel = appIpcs.deleteTaskType;

  async handle(id: string): Promise<void> {
    await Application.getInstance()
      .dependencies.get<DatabasesService>(dependencies.databases)
      .getDataSource('main')
      .getRepository<TaskType>(TaskType)
      .delete(id);
  }
}
