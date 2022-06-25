import { Application, DatabasesService, dependencies } from '@libraries/lib-electron';
import { IpcRequestHandlerInterface } from '@libraries/lib-electron-web';
import { appIpcs, ProjectEntity } from '@libraries/lib-scrum-toolbox';

export class RetrieveAllProjectsHandler implements IpcRequestHandlerInterface {
  channel = appIpcs.retrieveAllProjects;

  async handle(): Promise<ProjectEntity[]> {
    return Application.getInstance()
      .dependencies.get<DatabasesService>(dependencies.databases)
      .getConnection('main')
      .getRepository<ProjectEntity>(ProjectEntity)
      .find();
  }
}
