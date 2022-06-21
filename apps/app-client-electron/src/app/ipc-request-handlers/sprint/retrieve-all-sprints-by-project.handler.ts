import { Application, DatabasesService, dependencies } from '@libraries/lib-electron';
import { IpcRequestHandlerInterface } from '@libraries/lib-electron-web';
import { appIpcs, Sprint, Project } from '@libraries/lib-scrum-toolbox';
import { FindOptionsWhere } from 'typeorm';

export class RetrieveAllSprintsByProjectHandler implements IpcRequestHandlerInterface {
  channel = appIpcs.retrieveAllSprintsByProject;

  async handle(options: FindOptionsWhere<Project>): Promise<Sprint[]> {
    return Application.getInstance()
      .dependencies.get<DatabasesService>(dependencies.databases)
      .getDataSource('main')
      .getRepository<Sprint>(Sprint)
      .findBy({ project: options });
  }
}
