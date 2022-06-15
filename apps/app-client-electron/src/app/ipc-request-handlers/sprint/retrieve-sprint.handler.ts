import { Application, DatabasesService, dependencies } from '@libraries/lib-electron';
import { IpcRequestHandlerInterface } from '@libraries/lib-electron-web';
import { appIpcs, Sprint } from '@libraries/lib-scrum-toolbox';
import { FindOptionsWhere } from 'typeorm';

export class RetrieveSprintHandler implements IpcRequestHandlerInterface {
  channel = appIpcs.retrieveSprint;

  async handle(options: FindOptionsWhere<Sprint>): Promise<Sprint> {
    return Application.getInstance()
      .dependencies.get<DatabasesService>(dependencies.databases)
      .getDataSource('main')
      .getRepository<Sprint>(Sprint)
      .findOneBy(options);
  }
}
