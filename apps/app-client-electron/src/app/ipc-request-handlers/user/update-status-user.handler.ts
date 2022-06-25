import { Application, DatabasesService, dependencies } from '@libraries/lib-electron';
import { IpcRequestHandlerInterface } from '@libraries/lib-electron-web';
import { appIpcs, UserEntity } from '@libraries/lib-scrum-toolbox';

export class UpdateStatusUserHandler implements IpcRequestHandlerInterface {
  channel = appIpcs.updateStatusUser;

  async handle(data: { id: string; isActivated: boolean }): Promise<void> {
    await Application.getInstance()
      .dependencies.get<DatabasesService>(dependencies.databases)
      .getConnection('main')
      .createQueryBuilder()
      .update(UserEntity)
      .set({ isActivated: data.isActivated })
      .where('id = :id', { id: data.id })
      .execute();
  }
}
