import { Application, DatabasesService, dependencies } from '@libraries/lib-electron';
import { IpcRequestHandlerInterface } from '@libraries/lib-electron-web';
import { appIpcs, User, UserModel } from '@libraries/lib-scrum-toolbox';

export class RetrieveAllUsersHandler implements IpcRequestHandlerInterface {
  channel = appIpcs.retrieveAllUsers;

  async handle(): Promise<UserModel[]> {
    const users = await Application.getInstance()
      .dependencies.get<DatabasesService>(dependencies.databases)
      .getDataSource('main')
      .getRepository<User>(User)
      .find({
        order: {
          lastname: 'ASC',
          firstname: 'ASC',
        },
      });
    return users.map((user: User) => {
      return {
        id: user.id,
        username: user.username,
        firstname: user.firstname,
        lastname: user.lastname,
        createdAt: user.createdAt,
        isActivated: user.isActivated,
      };
    });
  }
}
