import { Application, DatabasesService, dependencies } from '@libraries/lib-electron';
import { IpcRequestHandlerInterface } from '@libraries/lib-electron-web';
import { appIpcs, TaskEntity } from '@libraries/lib-scrum-toolbox';

export class CreateTaskHandler implements IpcRequestHandlerInterface {
  channel = appIpcs.createTask;

  async handle(task: TaskEntity): Promise<TaskEntity> {
    await Application.getInstance()
      .dependencies.get<DatabasesService>(dependencies.databases)
      .getConnection('main')
      .getRepository<TaskEntity>(TaskEntity)
      .insert(task);

    return task;
  }
}
