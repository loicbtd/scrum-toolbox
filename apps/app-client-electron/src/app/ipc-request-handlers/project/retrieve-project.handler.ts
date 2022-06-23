import { Application, DatabasesService, dependencies } from '@libraries/lib-electron';
import { IpcRequestHandlerInterface } from '@libraries/lib-electron-web';
import { appIpcs, Project } from '@libraries/lib-scrum-toolbox';
import { FindConditions } from 'typeorm';

export class RetrieveProjectHandler implements IpcRequestHandlerInterface {
  channel = appIpcs.retrieveProject;

  async handle(options: FindConditions<Project>): Promise<Project> {
    return Application.getInstance()
      .dependencies.get<DatabasesService>(dependencies.databases)
      .getConnection('main')
      .getRepository<Project>(Project)
      .findOne(options);
  }
}
