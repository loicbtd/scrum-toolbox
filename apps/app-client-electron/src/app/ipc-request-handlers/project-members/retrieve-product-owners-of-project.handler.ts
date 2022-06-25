import { Application, DatabasesService, dependencies } from '@libraries/lib-electron';
import { IpcRequestHandlerInterface } from '@libraries/lib-electron-web';
import { appIpcs, UserEntity, ProjectMemberEntity } from '@libraries/lib-scrum-toolbox';

export class RetrieveProductOwnersOfProjectHandler implements IpcRequestHandlerInterface {
  channel = appIpcs.retrieveProductOwnersOfProject;

  async handle(projectId: string): Promise<UserEntity[]> {
    return Application.getInstance()
      .dependencies.get<DatabasesService>(dependencies.databases)
      .getConnection('main')
      .getRepository<ProjectMemberEntity>(ProjectMemberEntity)
      .find({ project: { id: projectId } });
  }
}
