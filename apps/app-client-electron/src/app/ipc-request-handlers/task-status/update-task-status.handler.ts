import { Application, DatabasesService, dependencies } from '@libraries/lib-electron';
import { IpcRequestHandlerInterface } from '@libraries/lib-electron-web';
import { appIpcs, TaskStatus } from '@libraries/lib-scrum-toolbox';

export class UpdateTaskStatusHandler implements IpcRequestHandlerInterface {
  channel = appIpcs.updateTaskStatus;

  async handle(taskStatus: TaskStatus): Promise<TaskStatus> {
    await Application.getInstance()
      .dependencies.get<DatabasesService>(dependencies.databases)
      .getConnection('main')
      .getRepository<TaskStatus>(TaskStatus)
      .save(taskStatus);

    return taskStatus;
  }
}
