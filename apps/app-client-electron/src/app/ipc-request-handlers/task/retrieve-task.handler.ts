import { Application, DatabasesService, dependencies } from '@libraries/lib-electron';
import { IpcRequestHandlerInterface } from '@libraries/lib-electron-web';
import { appIpcs, Task } from '@libraries/lib-scrum-toolbox';
import { FindOptionsWhere } from 'typeorm';

export class RetrieveTaskHandler implements IpcRequestHandlerInterface {
  channel = appIpcs.retrieveTask;

  async handle(options: FindOptionsWhere<Task>): Promise<Task> {
    return Application.getInstance()
      .dependencies.get<DatabasesService>(dependencies.databases)
      .getDataSource('main')
      .getRepository<Task>(Task)
      .findOneBy(options);
  }
}
