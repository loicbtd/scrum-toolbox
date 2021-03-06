import { Application, DatabasesService, dependencies } from '@libraries/lib-electron';
import { IpcRequestHandlerInterface } from '@libraries/lib-electron-web';
import { appIpcs, ProjectMemberEntity } from '@libraries/lib-scrum-toolbox';

export class AssignUserToProjectHandler implements IpcRequestHandlerInterface {
  channel = appIpcs.assignUserToProject;

  async handle(projectMember: ProjectMemberEntity): Promise<void> {
    await Application.getInstance()
      .dependencies.get<DatabasesService>(dependencies.databases)
      .getConnection('main')
      .getRepository<ProjectMemberEntity>(ProjectMemberEntity)
      .insert(projectMember);
  }
}
