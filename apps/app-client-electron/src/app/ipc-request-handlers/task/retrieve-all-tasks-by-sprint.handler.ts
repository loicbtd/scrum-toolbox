import { Application, DatabasesService, dependencies } from '@libraries/lib-electron';
import { IpcRequestHandlerInterface } from '@libraries/lib-electron-web';
import { appIpcs, Task } from '@libraries/lib-scrum-toolbox';

export class RetrieveAllTasksBySprintHandler implements IpcRequestHandlerInterface {
  channel = appIpcs.retrieveAllTasksBySprint;

  async handle(sprintId: string): Promise<Task[]> {
    return Application.getInstance()
      .dependencies.get<DatabasesService>(dependencies.databases)
      .getConnection('main')
      .getRepository<Task>(Task)
      .find({ sprint: { id: sprintId } });
  }
}
