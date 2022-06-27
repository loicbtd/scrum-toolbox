import { Application, DatabasesService, dependencies } from '@libraries/lib-electron';
import { IpcRequestHandlerInterface } from '@libraries/lib-electron-web';
import { appIpcs, TaskEntity } from '@libraries/lib-scrum-toolbox';

export class DeleteTaskHandler implements IpcRequestHandlerInterface {
  channel = appIpcs.deleteTask;

  async handle(id: string): Promise<void> {
    await Application.getInstance()
      .dependencies.get<DatabasesService>(dependencies.databases)
      .getConnection('main')
      .getRepository<TaskEntity>(TaskEntity)
      .delete(id);
  }
}
