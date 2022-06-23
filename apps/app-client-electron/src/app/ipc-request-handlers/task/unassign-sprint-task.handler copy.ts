import { Application, DatabasesService, dependencies } from '@libraries/lib-electron';
import { IpcRequestHandlerInterface } from '@libraries/lib-electron-web';
import { appIpcs, Task } from '@libraries/lib-scrum-toolbox';

export class UnassignSprintTaskHandler implements IpcRequestHandlerInterface {
  channel = appIpcs.unassignTaskToSprint;

  async handle(taskId: string): Promise<void> {
    const connection = Application.getInstance()
      .dependencies.get<DatabasesService>(dependencies.databases)
      .getConnection('main');

    await connection
      .getRepository<Task>(Task)
      .createQueryBuilder()
      .update(Task)
      .set({ sprint: null })
      .where('id = :id', { id: taskId })
      .execute();
  }
}
