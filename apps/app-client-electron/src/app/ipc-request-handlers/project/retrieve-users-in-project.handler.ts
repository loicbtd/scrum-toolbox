import { Application, DatabasesService, dependencies } from '@libraries/lib-electron';
import { IpcRequestHandlerInterface } from '@libraries/lib-electron-web';
import { appIpcs, ProjectMemberEntity } from '@libraries/lib-scrum-toolbox';

export class RetrieveAllUsersInProject implements IpcRequestHandlerInterface {
  channel = appIpcs.retrieveAllUsersInProject;

  async handle(projectId: string): Promise<ProjectMemberEntity[]> {
    return Application.getInstance()
      .dependencies.get<DatabasesService>(dependencies.databases)
      .getConnection('main')
      .getRepository<ProjectMemberEntity>(ProjectMemberEntity)
      .find({ project: { id: projectId } });
  }
}
