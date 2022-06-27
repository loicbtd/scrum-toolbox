import { Application, DatabasesService, dependencies } from '@libraries/lib-electron';
import { IpcRequestHandlerInterface } from '@libraries/lib-electron-web';
import { appIpcs, UserEntity, ProjectMemberEntity } from '@libraries/lib-scrum-toolbox';

export class RetrieveScrumMastersOfProjectHandler implements IpcRequestHandlerInterface {
  channel = appIpcs.retrieveScrumMastersOfProject;

  async handle(projectId: string): Promise<UserEntity[]> {
    return Application.getInstance()
      .dependencies.get<DatabasesService>(dependencies.databases)
      .getConnection('main')
      .getRepository<ProjectMemberEntity>(ProjectMemberEntity)
      .find({ project: { id: projectId } });
  }
}
