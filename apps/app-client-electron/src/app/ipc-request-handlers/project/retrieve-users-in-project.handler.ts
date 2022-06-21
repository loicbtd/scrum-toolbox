import { Application, DatabasesService, dependencies } from '@libraries/lib-electron';
import { IpcRequestHandlerInterface } from '@libraries/lib-electron-web';
import { appIpcs, UserUserTypeProject } from '@libraries/lib-scrum-toolbox';

export class RetrieveAllUsersInProject implements IpcRequestHandlerInterface {
  channel = appIpcs.retrieveAllUsersInProject;

  async handle(projectId: string): Promise<UserUserTypeProject[]> {
    return Application.getInstance()
      .dependencies.get<DatabasesService>(dependencies.databases)
      .getDataSource('main')
      .getRepository<UserUserTypeProject>(UserUserTypeProject)
      .findBy({ project: { id: projectId } });
  }
}
