import { Application, DatabasesService, dependencies } from '@libraries/lib-electron';
import { IpcRequestHandlerInterface } from '@libraries/lib-electron-web';
import { appIpcs, SprintEntity } from '@libraries/lib-scrum-toolbox';

export class RetrieveAllSprintsHandler implements IpcRequestHandlerInterface {
  channel = appIpcs.retrieveAllSprints;

  async handle(): Promise<SprintEntity[]> {
    return Application.getInstance()
      .dependencies.get<DatabasesService>(dependencies.databases)
      .getConnection('main')
      .getRepository<SprintEntity>(SprintEntity)
      .find();
  }
}
