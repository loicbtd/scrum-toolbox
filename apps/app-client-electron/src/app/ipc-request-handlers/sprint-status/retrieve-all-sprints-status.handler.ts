import { Application, DatabasesService, dependencies } from '@libraries/lib-electron';
import { IpcRequestHandlerInterface } from '@libraries/lib-electron-web';
import { appIpcs, SprintStatusEntity } from '@libraries/lib-scrum-toolbox';

export class RetrieveAllSprintStatusHandler implements IpcRequestHandlerInterface {
  channel = appIpcs.retrieveAllSprintsStatus;

  async handle(): Promise<SprintStatusEntity[]> {
    return Application.getInstance()
      .dependencies.get<DatabasesService>(dependencies.databases)
      .getConnection('main')
      .getRepository<SprintStatusEntity>(SprintStatusEntity)
      .find();
  }
}
