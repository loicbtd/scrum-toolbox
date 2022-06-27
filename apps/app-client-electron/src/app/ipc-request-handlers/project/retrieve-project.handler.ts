import { Application, DatabasesService, dependencies } from '@libraries/lib-electron';
import { IpcRequestHandlerInterface } from '@libraries/lib-electron-web';
import { appIpcs, ProjectEntity } from '@libraries/lib-scrum-toolbox';
import { FindConditions } from 'typeorm';

export class RetrieveProjectHandler implements IpcRequestHandlerInterface {
  channel = appIpcs.retrieveProject;

  async handle(options: FindConditions<ProjectEntity>): Promise<ProjectEntity> {
    return Application.getInstance()
      .dependencies.get<DatabasesService>(dependencies.databases)
      .getConnection('main')
      .getRepository<ProjectEntity>(ProjectEntity)
      .findOne(options);
  }
}
