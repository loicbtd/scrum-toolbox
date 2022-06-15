import { Application, DatabasesService, dependencies } from '@libraries/lib-electron';
import { IpcRequestHandlerInterface } from '@libraries/lib-electron-web';
import { appIpcs, Project } from '@libraries/lib-scrum-toolbox';

export class DeleteProjectHandler implements IpcRequestHandlerInterface {
  channel = appIpcs.deleteProject;

  async handle(id: string): Promise<void> {
    await Application.getInstance()
      .dependencies.get<DatabasesService>(dependencies.databases)
      .getDataSource('main')
      .getRepository<Project>(Project)
      .delete(id);
  }
}