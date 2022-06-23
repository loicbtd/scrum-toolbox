import { Application, DatabasesService, dependencies } from '@libraries/lib-electron';
import { IpcRequestHandlerInterface } from '@libraries/lib-electron-web';
import { appIpcs, SprintStatus } from '@libraries/lib-scrum-toolbox';

export class UpdateSprintStatusHandler implements IpcRequestHandlerInterface {
  channel = appIpcs.updateSprintStatus;

  async handle(sprint_status: SprintStatus): Promise<SprintStatus> {
    await Application.getInstance()
      .dependencies.get<DatabasesService>(dependencies.databases)
      .getConnection('main')
      .getRepository<SprintStatus>(SprintStatus)
      .save(sprint_status);
    return sprint_status;
  }
}
