import { Application, DatabasesService, dependencies } from '@libraries/lib-electron';
import { IpcRequestHandlerInterface } from '@libraries/lib-electron-web';
import { appIpcs, SprintStatusEntity } from '@libraries/lib-scrum-toolbox';

export class UpdateSprintStatusHandler implements IpcRequestHandlerInterface {
  channel = appIpcs.updateSprintStatus;

  async handle(sprint_status: SprintStatusEntity): Promise<SprintStatusEntity> {
    await Application.getInstance()
      .dependencies.get<DatabasesService>(dependencies.databases)
      .getConnection('main')
      .getRepository<SprintStatusEntity>(SprintStatusEntity)
      .save(sprint_status);
    return sprint_status;
  }
}
