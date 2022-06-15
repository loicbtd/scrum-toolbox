import { Application, DatabasesService, dependencies } from '@libraries/lib-electron';
import { IpcRequestHandlerInterface } from '@libraries/lib-electron-web';
import { appIpcs, Project } from '@libraries/lib-scrum-toolbox';

export class UpdateProjectHandler implements IpcRequestHandlerInterface {
  channel = appIpcs.updateProject;

  async handle(project: Project): Promise<Project> {
    await Application.getInstance()
      .dependencies.get<DatabasesService>(dependencies.databases)
      .getDataSource('main')
      .getRepository<Project>(Project)
      .update({ id: project.id }, project);
    return project;
  }
}
