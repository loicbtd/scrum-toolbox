import { Application, DatabasesService, dependencies } from '@libraries/lib-electron';
import { IpcRequestHandlerInterface } from '@libraries/lib-electron-web';
import { appIpcs, Sprint } from '@libraries/lib-scrum-toolbox';

export class UpdateSprintHandler implements IpcRequestHandlerInterface {
  channel = appIpcs.updateSprint;

  async handle(sprint: Sprint): Promise<Sprint> {
    await Application.getInstance()
      .dependencies.get<DatabasesService>(dependencies.databases)
      .getDataSource('main')
      .getRepository<Sprint>(Sprint)
      .update({ id: sprint.id }, sprint);
    return sprint;
  }
}
