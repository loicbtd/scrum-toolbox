import { Application, DatabasesService, dependencies } from '@libraries/lib-electron';
import { IpcRequestHandlerInterface } from '@libraries/lib-electron-web';
import { appIpcs, errorsName, Sprint, SprintStatus } from '@libraries/lib-scrum-toolbox';

export class DeleteSprintStatusHandler implements IpcRequestHandlerInterface {
  channel = appIpcs.deleteSprintStatus;

  async handle(id: string): Promise<void> {
    const connection = Application.getInstance()
      .dependencies.get<DatabasesService>(dependencies.databases)
      .getConnection('main');
    if ((await connection.getRepository<Sprint>(Sprint).count({ status: { id: id } })) == 0) {
      await connection.getRepository<SprintStatus>(SprintStatus).delete(id);
    } else {
      throw new Error(errorsName.statusIsCurrentlyUsed);
    }
  }
}
