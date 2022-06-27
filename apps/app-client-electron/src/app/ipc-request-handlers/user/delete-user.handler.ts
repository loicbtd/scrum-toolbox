import { Application, DatabasesService, dependencies } from '@libraries/lib-electron';
import { IpcRequestHandlerInterface } from '@libraries/lib-electron-web';
import { appIpcs, UserEntity } from '@libraries/lib-scrum-toolbox';

export class DeleteUserHandler implements IpcRequestHandlerInterface {
  channel = appIpcs.deleteUser;

  async handle(id: string): Promise<void> {
    await Application.getInstance()
      .dependencies.get<DatabasesService>(dependencies.databases)
      .getConnection('main')
      .getRepository<UserEntity>(UserEntity)
      .delete(id);
  }
}
