import { Application, DatabasesService, dependencies } from '@libraries/lib-electron';
import { IpcRequestHandlerInterface } from '@libraries/lib-electron-web';
import { appIpcs, Task } from '@libraries/lib-scrum-toolbox';

export class UpdateTaskHandler implements IpcRequestHandlerInterface {
  channel = appIpcs.updateTask;

  async handle(task: Task): Promise<Task> {
    await Application.getInstance()
      .dependencies.get<DatabasesService>(dependencies.databases)
      .getDataSource('main')
      .getRepository<Task>(Task)
      .update({ id: task.id }, task);
    return task;
  }
}
