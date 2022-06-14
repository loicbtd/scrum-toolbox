import { Application, DatabasesService, dependencies } from '@libraries/lib-electron';
import { IpcRequestHandlerInterface } from '@libraries/lib-electron-web';
import { appIpcs, Sprint } from '@libraries/lib-scrum-toolbox';

export class RetrieveAllSprintsHandler implements IpcRequestHandlerInterface {
  channel = appIpcs.retrieveAllSprints;

  async handle(): Promise<Sprint[]> {
    return Application.getInstance()
      .dependencies.get<DatabasesService>(dependencies.databases)
      .getDataSource('main')
      .getRepository<Sprint>(Sprint)
      .find();
  }
}
