import { Application, DatabasesService, dependencies } from '@libraries/lib-electron';
import { IpcRequestHandlerInterface } from '@libraries/lib-electron-web';
import { appIpcs, ProjectEntity } from '@libraries/lib-scrum-toolbox';

export class DeleteProjectHandler implements IpcRequestHandlerInterface {
  channel = appIpcs.deleteProject;

  async handle(id: string): Promise<void> {
    await Application.getInstance()
      .dependencies.get<DatabasesService>(dependencies.databases)
      .getConnection('main')
      .getRepository<ProjectEntity>(ProjectEntity)
      .delete(id);
  }
}
