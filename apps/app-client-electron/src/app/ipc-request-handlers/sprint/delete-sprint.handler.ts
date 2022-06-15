import { Application, DatabasesService, dependencies } from '@libraries/lib-electron';
import { IpcRequestHandlerInterface } from '@libraries/lib-electron-web';
import { appIpcs, Sprint } from '@libraries/lib-scrum-toolbox';

export class DeleteSprintHandler implements IpcRequestHandlerInterface {
  channel = appIpcs.deleteSprint;

  async handle(id: string): Promise<void> {
    await Application.getInstance()
      .dependencies.get<DatabasesService>(dependencies.databases)
      .getDataSource('main')
      .getRepository<Sprint>(Sprint)
      .delete(id);
  }
}
