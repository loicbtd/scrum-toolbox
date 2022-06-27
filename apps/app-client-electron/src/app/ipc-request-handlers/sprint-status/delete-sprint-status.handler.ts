import { Application, DatabasesService, dependencies } from '@libraries/lib-electron';
import { IpcRequestHandlerInterface } from '@libraries/lib-electron-web';
import { appIpcs, SprintStatusEntity } from '@libraries/lib-scrum-toolbox';

export class DeleteSprintStatusHandler implements IpcRequestHandlerInterface {
  channel = appIpcs.deleteSprintStatus;

  async handle(id: string): Promise<void> {
    const connection = Application.getInstance()
      .dependencies.get<DatabasesService>(dependencies.databases)
      .getConnection('main');

    await connection.getRepository<SprintStatusEntity>(SprintStatusEntity).delete(id);
  }
}
