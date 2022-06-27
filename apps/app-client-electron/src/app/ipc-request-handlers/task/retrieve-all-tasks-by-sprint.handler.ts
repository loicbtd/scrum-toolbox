import { Application, DatabasesService, dependencies } from '@libraries/lib-electron';
import { IpcRequestHandlerInterface } from '@libraries/lib-electron-web';
import { appIpcs, TaskEntity } from '@libraries/lib-scrum-toolbox';

export class RetrieveAllTasksBySprintHandler implements IpcRequestHandlerInterface {
  channel = appIpcs.retrieveAllTasksBySprint;

  async handle(sprintId: string): Promise<TaskEntity[]> {
    return Application.getInstance()
      .dependencies.get<DatabasesService>(dependencies.databases)
      .getConnection('main')
      .getRepository<TaskEntity>(TaskEntity)
      .find({ sprint: { id: sprintId } });
  }
}
