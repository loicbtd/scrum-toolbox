import { Application, DatabasesService, dependencies } from '@libraries/lib-electron';
import { IpcRequestHandlerInterface } from '@libraries/lib-electron-web';
import { appIpcs, User, Task } from '@libraries/lib-scrum-toolbox';

export class AssignUserTaskHandler implements IpcRequestHandlerInterface {
  channel = appIpcs.assignTaskToUser;

  async handle(data: { taskId: string; userId: string }): Promise<void> {
    const datasource = Application.getInstance()
      .dependencies.get<DatabasesService>(dependencies.databases)
      .getDataSource('main');
    const user = await datasource.getRepository(User).findOneByOrFail({ id: data.userId });
    const task = await datasource.getRepository(Task).findOneByOrFail({ id: data.taskId });
    task.users.push(user);
    await datasource.getRepository(Task).save(task);
  }
}
