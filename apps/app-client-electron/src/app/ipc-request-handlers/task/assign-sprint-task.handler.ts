import { Application, DatabasesService, dependencies } from '@libraries/lib-electron';
import { IpcRequestHandlerInterface } from '@libraries/lib-electron-web';
import { appIpcs, Sprint, Task } from '@libraries/lib-scrum-toolbox';

export class AssignSprintTaskHandler implements IpcRequestHandlerInterface {
  channel = appIpcs.assignTaskToSprint;

  async handle(data: { taskId: string; sprintId: string }): Promise<void> {
    const connection = Application.getInstance()
      .dependencies.get<DatabasesService>(dependencies.databases)
      .getConnection('main');

    const sprint = await connection.getRepository(Sprint).findOneOrFail({ id: data.sprintId });

    await connection
      .getRepository<Task>(Task)
      .createQueryBuilder()
      .update(Task)
      .set({ sprint: sprint })
      .where('id = :id', { id: data.taskId })
      .execute();
  }
}
