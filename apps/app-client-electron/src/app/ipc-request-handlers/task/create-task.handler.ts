import { Application, DatabasesService, dependencies } from '@libraries/lib-electron';
import { IpcRequestHandlerInterface } from '@libraries/lib-electron-web';
import { appIpcs, Task } from '@libraries/lib-scrum-toolbox';

export class CreateTaskHandler implements IpcRequestHandlerInterface {
  channel = appIpcs.createTask;

  async handle(task: Task): Promise<Task> {
    await Application.getInstance()
      .dependencies.get<DatabasesService>(dependencies.databases)
      .getConnection('main')
      .getRepository<Task>(Task)
      .insert(task);

    return task;
  }
}
