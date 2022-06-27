import { Application, DatabasesService, dependencies } from '@libraries/lib-electron';
import { IpcRequestHandlerInterface } from '@libraries/lib-electron-web';
import { appIpcs, TaskStatusEntity } from '@libraries/lib-scrum-toolbox';

export class DeleteTaskStatusHandler implements IpcRequestHandlerInterface {
  channel = appIpcs.deleteTaskStatus;

  async handle(id: string): Promise<void> {
    const connection = Application.getInstance()
      .dependencies.get<DatabasesService>(dependencies.databases)
      .getConnection('main');

    await connection.getRepository<TaskStatusEntity>(TaskStatusEntity).delete(id);
  }
}
