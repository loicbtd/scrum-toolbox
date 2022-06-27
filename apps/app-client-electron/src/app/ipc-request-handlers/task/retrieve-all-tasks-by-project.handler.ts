import { Application, DatabasesService, dependencies } from '@libraries/lib-electron';
import { IpcRequestHandlerInterface } from '@libraries/lib-electron-web';
import { appIpcs, TaskEntity } from '@libraries/lib-scrum-toolbox';

export class RetrieveAllTasksByProjectHandler implements IpcRequestHandlerInterface {
  channel = appIpcs.retrieveAllTasksByProject;

  async handle(projectId: string): Promise<TaskEntity[]> {
    return Application.getInstance()
      .dependencies.get<DatabasesService>(dependencies.databases)
      .getConnection('main')
      .getRepository<TaskEntity>(TaskEntity)
      .find({ project: { id: projectId } });
  }
}
