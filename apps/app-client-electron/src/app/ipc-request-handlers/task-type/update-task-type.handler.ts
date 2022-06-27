import { Application, DatabasesService, dependencies } from '@libraries/lib-electron';
import { IpcRequestHandlerInterface } from '@libraries/lib-electron-web';
import { appIpcs, TaskTypeEntity } from '@libraries/lib-scrum-toolbox';

export class UpdateTaskTypeHandler implements IpcRequestHandlerInterface {
  channel = appIpcs.updateTaskType;

  async handle(taskType: TaskTypeEntity): Promise<TaskTypeEntity> {
    await Application.getInstance()
      .dependencies.get<DatabasesService>(dependencies.databases)
      .getConnection('main')
      .getRepository<TaskTypeEntity>(TaskTypeEntity)
      .save(taskType);
    return taskType;
  }
}
