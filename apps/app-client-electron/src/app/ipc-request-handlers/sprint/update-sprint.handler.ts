import { Application, DatabasesService, dependencies } from '@libraries/lib-electron';
import { IpcRequestHandlerInterface } from '@libraries/lib-electron-web';
import { appIpcs, SprintEntity } from '@libraries/lib-scrum-toolbox';

export class UpdateSprintHandler implements IpcRequestHandlerInterface {
  channel = appIpcs.updateSprint;

  async handle(sprint: SprintEntity): Promise<SprintEntity> {
    await Application.getInstance()
      .dependencies.get<DatabasesService>(dependencies.databases)
      .getConnection('main')
      .getRepository<SprintEntity>(SprintEntity)
      .save(sprint);
    return sprint;
  }
}
