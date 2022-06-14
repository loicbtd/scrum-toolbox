import { Application, DatabasesService, dependencies } from '@libraries/lib-electron';
import { IpcRequestHandlerInterface } from '@libraries/lib-electron-web';
import { appIpcs, Project } from '@libraries/lib-scrum-toolbox';
import { FindOptionsWhere } from 'typeorm';

export class RetrieveProjectHandler implements IpcRequestHandlerInterface {
  channel = appIpcs.retrieveProject;

  async handle(options: FindOptionsWhere<Project>): Promise<Project> {
    return Application.getInstance()
      .dependencies.get<DatabasesService>(dependencies.databases)
      .getDataSource('main')
      .getRepository<Project>(Project)
      .findOneBy(options);
  }
}
