import { Application, DatabasesService, dependencies } from '@libraries/lib-electron';
import { IpcRequestHandlerInterface } from '@libraries/lib-electron-web';
import { appIpcs, TaskTypeEntity } from '@libraries/lib-scrum-toolbox';

export class DeleteTaskTypeHandler implements IpcRequestHandlerInterface {
  channel = appIpcs.deleteTaskType;

  async handle(id: string): Promise<void> {
    const connection = Application.getInstance()
      .dependencies.get<DatabasesService>(dependencies.databases)
      .getConnection('main');

    await connection.getRepository<TaskTypeEntity>(TaskTypeEntity).delete(id);
  }
}
