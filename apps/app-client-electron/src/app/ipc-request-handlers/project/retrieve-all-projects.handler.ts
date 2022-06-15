import { Application, DatabasesService, dependencies } from '@libraries/lib-electron';
import { IpcRequestHandlerInterface } from '@libraries/lib-electron-web';
import { appIpcs, Project } from '@libraries/lib-scrum-toolbox';

export class RetrieveAllProjectsHandler implements IpcRequestHandlerInterface {
  channel = appIpcs.retrieveAllProjects;

  async handle(): Promise<Project[]> {
    return Application.getInstance()
      .dependencies.get<DatabasesService>(dependencies.databases)
      .getDataSource('main')
      .getRepository<Project>(Project)
      .find();
  }
}
