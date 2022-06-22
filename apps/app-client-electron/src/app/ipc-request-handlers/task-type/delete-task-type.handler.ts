import { Application, DatabasesService, dependencies } from '@libraries/lib-electron';
import { IpcRequestHandlerInterface } from '@libraries/lib-electron-web';
import { appIpcs, errorsName, Task, TaskType } from '@libraries/lib-scrum-toolbox';

export class DeleteTaskTypeHandler implements IpcRequestHandlerInterface {
  channel = appIpcs.deleteTaskType;

  async handle(id: string): Promise<void> {
    const connection = Application.getInstance()
      .dependencies.get<DatabasesService>(dependencies.databases)
      .getConnection('main');
    if ((await connection.getRepository<Task>(Task).count({ status: { id: id } })) == 0) {
      await connection.getRepository<TaskType>(TaskType).delete(id);
    } else {
      throw new Error(errorsName.typeIsCurrentlyUsed);
    }
  }
}
