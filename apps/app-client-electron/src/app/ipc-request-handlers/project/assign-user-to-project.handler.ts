import { Application, DatabasesService, dependencies } from '@libraries/lib-electron';
import { IpcRequestHandlerInterface } from '@libraries/lib-electron-web';
import { appIpcs, UserUserTypeProject } from '@libraries/lib-scrum-toolbox';

export class AssignUserToProjectHandler implements IpcRequestHandlerInterface {
  channel = appIpcs.assignUserToProject;

  async handle(uutp: UserUserTypeProject): Promise<void> {
    await Application.getInstance()
      .dependencies.get<DatabasesService>(dependencies.databases)
      .getConnection('main')
      .getRepository<UserUserTypeProject>(UserUserTypeProject)
      .insert(uutp);
  }
}
