import { Application, DatabasesService, dependencies } from '@libraries/lib-electron';
import { IpcRequestHandlerInterface } from '@libraries/lib-electron-web';
import { appIpcs, TaskStatus } from '@libraries/lib-scrum-toolbox';

export class CreateTaskStatusHandler implements IpcRequestHandlerInterface {
  channel = appIpcs.createTaskStatus;

  async handle(taskStatus: TaskStatus): Promise<TaskStatus> {
    await Application.getInstance()
      .dependencies.get<DatabasesService>(dependencies.databases)
      .getDataSource('main')
      .getRepository<TaskStatus>(TaskStatus)
      .insert(taskStatus);
    return taskStatus;
  }
}
