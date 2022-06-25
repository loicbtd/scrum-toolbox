import { Application, DatabasesService, dependencies } from '@libraries/lib-electron';
import { IpcRequestHandlerInterface } from '@libraries/lib-electron-web';
import { appIpcs, TaskTypeEntity } from '@libraries/lib-scrum-toolbox';

export class RetrieveAllTaskTypesHandler implements IpcRequestHandlerInterface {
  channel = appIpcs.retrieveAllTasksType;

  async handle(): Promise<TaskTypeEntity[]> {
    return Application.getInstance()
      .dependencies.get<DatabasesService>(dependencies.databases)
      .getConnection('main')
      .getRepository<TaskTypeEntity>(TaskTypeEntity)
      .find();
  }
}
