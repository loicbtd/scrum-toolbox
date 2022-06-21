import { Application, DatabasesService, dependencies } from '@libraries/lib-electron';
import { IpcRequestHandlerInterface } from '@libraries/lib-electron-web';
import { appIpcs, Project } from '@libraries/lib-scrum-toolbox';

export class CreateProjectHandler implements IpcRequestHandlerInterface {
  channel = appIpcs.createProject;

  async handle(project: Project): Promise<Project> {
    await Application.getInstance()
      .dependencies.get<DatabasesService>(dependencies.databases)
      .getConnection('main')
      .getRepository<Project>(Project)
      .insert(project);
    return project;
  }
}
