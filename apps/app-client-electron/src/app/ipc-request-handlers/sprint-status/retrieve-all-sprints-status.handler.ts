import { Application, DatabasesService, dependencies } from '@libraries/lib-electron';
import { IpcRequestHandlerInterface } from '@libraries/lib-electron-web';
import { appIpcs, SprintStatus } from '@libraries/lib-scrum-toolbox';

export class RetrieveAllSprintStatusHandler implements IpcRequestHandlerInterface {
  channel = appIpcs.retrieveAllSprintsStatus;

  async handle(): Promise<SprintStatus[]> {
    return Application.getInstance()
      .dependencies.get<DatabasesService>(dependencies.databases)
      .getDataSource('main')
      .getRepository<SprintStatus>(SprintStatus)
      .find();
  }
}
