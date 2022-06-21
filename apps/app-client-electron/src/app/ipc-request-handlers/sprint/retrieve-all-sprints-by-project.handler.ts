import { Application, DatabasesService, dependencies } from '@libraries/lib-electron';
import { IpcRequestHandlerInterface } from '@libraries/lib-electron-web';
import { appIpcs, Sprint, Project } from '@libraries/lib-scrum-toolbox';
import { FindConditions } from 'typeorm';

export class RetrieveAllSprintsByProjectHandler implements IpcRequestHandlerInterface {
  channel = appIpcs.retrieveAllSprintsByProject;

  async handle(options: FindConditions<Project>): Promise<Sprint[]> {
    return Application.getInstance()
      .dependencies.get<DatabasesService>(dependencies.databases)
      .getConnection('main')
      .getRepository<Sprint>(Sprint)
      .find({ project: options });
  }
}
