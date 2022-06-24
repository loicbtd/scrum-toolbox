import { Application, DatabasesService, dependencies } from '@libraries/lib-electron';
import { IpcRequestHandlerInterface } from '@libraries/lib-electron-web';
import { appIpcs, errorsName, UserType, UserUserTypeProject } from '@libraries/lib-scrum-toolbox';

export class DeleteUserTypeHandler implements IpcRequestHandlerInterface {
  channel = appIpcs.deleteUserType;

  async handle(id: string): Promise<void> {
    const connection = Application.getInstance()
      .dependencies.get<DatabasesService>(dependencies.databases)
      .getConnection('main');
    if (
      (await connection.getRepository<UserUserTypeProject>(UserUserTypeProject).count({ userType: { id: id } })) == 0
    ) {
      await connection.getRepository<UserType>(UserType).delete(id);
    } else {
      throw new Error(errorsName.typeIsCurrentlyUsed);
    }
  }
}
