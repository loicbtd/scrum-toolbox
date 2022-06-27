import { Application, DatabasesService, dependencies } from '@libraries/lib-electron';
import { IpcRequestHandlerInterface } from '@libraries/lib-electron-web';
import { appIpcs, ProjectEntity } from '@libraries/lib-scrum-toolbox';

export class CreateProjectHandler implements IpcRequestHandlerInterface {
  channel = appIpcs.createProject;

  async handle(project: ProjectEntity): Promise<ProjectEntity> {
    await Application.getInstance()
      .dependencies.get<DatabasesService>(dependencies.databases)
      .getConnection('main')
      .getRepository<ProjectEntity>(ProjectEntity)
      .insert(project);
    return project;
  }
}
