import { Application, DatabasesService, dependencies } from '@libraries/lib-electron';
import { IpcRequestHandlerInterface } from '@libraries/lib-electron-web';
import { appIpcs, Task } from '@libraries/lib-scrum-toolbox';

export class RetrieveAllTasksByProjectHandler implements IpcRequestHandlerInterface {
  channel = appIpcs.retrieveAllTasksByProject;

  async handle(projectId: string): Promise<Task[]> {
    console.log('LA');

    return Application.getInstance()
      .dependencies.get<DatabasesService>(dependencies.databases)
      .getConnection('main')
      .getRepository<Task>(Task)
      .find({ project: { id: projectId } });
  }
}
