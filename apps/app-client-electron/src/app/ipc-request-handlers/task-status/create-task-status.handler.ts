import { Application, DatabasesService, dependencies } from '@libraries/lib-electron';
import { IpcRequestHandlerInterface } from '@libraries/lib-electron-web';
import { appIpcs, TaskStatusEntity } from '@libraries/lib-scrum-toolbox';

export class CreateTaskStatusHandler implements IpcRequestHandlerInterface {
  channel = appIpcs.createTaskStatus;

  async handle(taskStatus: TaskStatusEntity): Promise<TaskStatusEntity> {
    await Application.getInstance()
      .dependencies.get<DatabasesService>(dependencies.databases)
      .getConnection('main')
      .getRepository<TaskStatusEntity>(TaskStatusEntity)
      .insert(taskStatus);

    return taskStatus;
  }
}
