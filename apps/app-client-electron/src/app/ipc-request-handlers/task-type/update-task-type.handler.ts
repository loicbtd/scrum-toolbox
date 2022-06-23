import { Application, DatabasesService, dependencies } from '@libraries/lib-electron';
import { IpcRequestHandlerInterface } from '@libraries/lib-electron-web';
import { appIpcs, TaskType } from '@libraries/lib-scrum-toolbox';

export class UpdateTaskTypeHandler implements IpcRequestHandlerInterface {
  channel = appIpcs.updateTaskType;

  async handle(taskType: TaskType): Promise<TaskType> {
    await Application.getInstance()
      .dependencies.get<DatabasesService>(dependencies.databases)
      .getConnection('main')
      .getRepository<TaskType>(TaskType)
      .save(taskType);
    return taskType;
  }
}
