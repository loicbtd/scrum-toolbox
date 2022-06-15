import { Application, DatabasesService, dependencies } from '@libraries/lib-electron';
import { IpcRequestHandlerInterface } from '@libraries/lib-electron-web';
import { appIpcs, SprintStatus } from '@libraries/lib-scrum-toolbox';

export class DeleteSprintStatusHandler implements IpcRequestHandlerInterface {
  channel = appIpcs.deleteSprintStatus;

  async handle(id: string): Promise<void> {
    await Application.getInstance()
      .dependencies.get<DatabasesService>(dependencies.databases)
      .getDataSource('main')
      .getRepository<SprintStatus>(SprintStatus)
      .delete(id);
  }
}
