import { Application, DatabasesService, dependencies } from '@libraries/lib-electron';
import { IpcRequestHandlerInterface } from '@libraries/lib-electron-web';
import { appIpcs, Sprint, Task } from '@libraries/lib-scrum-toolbox';

export class AssignSprintTaskHandler implements IpcRequestHandlerInterface {
  channel = appIpcs.assignTaskToSprint;

  async handle(data: { taskId: string; sprintId: string }): Promise<void> {
    const datasource = Application.getInstance()
      .dependencies.get<DatabasesService>(dependencies.databases)
      .getDataSource('main');
    const sprint = await datasource.getRepository(Sprint).findOneByOrFail({ id: data.sprintId });
    await datasource
      .getRepository<Task>(Task)
      .createQueryBuilder()
      .update(Task)
      .set({ sprint: sprint })
      .where('id = :id', { id: data.taskId })
      .execute();
  }
}
