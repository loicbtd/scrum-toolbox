import { Application, DatabasesService, dependencies } from '@libraries/lib-electron';
import { IpcRequestHandlerInterface } from '@libraries/lib-electron-web';
import { appIpcs, Task } from '@libraries/lib-scrum-toolbox';

export class UpdateTaskHandler implements IpcRequestHandlerInterface {
  channel = appIpcs.updateTask;

  async handle(task: Task): Promise<Task> {   
    await Application.getInstance()
      .dependencies.get<DatabasesService>(dependencies.databases)
      .getConnection('main')
      .getRepository<Task>(Task)
      .save(task);

    return task;
  }
}
