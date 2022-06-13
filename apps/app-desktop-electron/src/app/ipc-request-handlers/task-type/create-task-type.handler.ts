import { Application, DatabasesService, dependencies } from '@libraries/lib-electron';
import { IpcRequestHandlerInterface } from '@libraries/lib-electron-web';
import { appIpcs, TaskType } from '@libraries/lib-scrum-toolbox';

export class CreateTaskTypeHandler implements IpcRequestHandlerInterface {
  channel = appIpcs.createTaskType;

  async handle(taskType: TaskType): Promise<TaskType> {
    await Application.getInstance()
      .dependencies.get<DatabasesService>(dependencies.databases)
      .getDataSource('main')
      .getRepository<TaskType>(TaskType)
      .insert(taskType);
    return taskType;
  }
}
