import { Application, DatabasesService, dependencies } from '@libraries/lib-electron';
import { IpcRequestHandlerInterface } from '@libraries/lib-electron-web';
import { appIpcs, UserEntity, UserModel } from '@libraries/lib-scrum-toolbox';

export class RetrieveAllUsersNotInProjectHandler implements IpcRequestHandlerInterface {
  channel = appIpcs.retrieveAllUsersNotInProject;

  async handle(projectId: string): Promise<UserModel[]> {
    const users = await Application.getInstance()
      .dependencies.get<DatabasesService>(dependencies.databases)
      .getConnection('main')
      .getRepository<UserEntity>(UserEntity)
      .createQueryBuilder('u')
      .select('u.id as id')
      .addSelect('u.username as username')
      .addSelect('u.firstname as firstname')
      .addSelect('u.lastname as lastname')
      .addSelect('u.createdAt as createdAt')
      .orderBy('u.lastname')
      .addOrderBy('u.firstname')
      .where('u.id NOT IN (SELECT uutp.userId FROM user_user_type_project as uutp WHERE uutp.projectId = :pId)', {
        pId: projectId,
      })
      .andWhere('u.isActivated = true')
      .execute();
    return users.map((user: UserEntity) => {
      return {
        id: user.id,
        username: user.username,
        firstname: user.firstname,
        lastname: user.lastname,
        createdAt: user.createdAt,
      };
    });
  }
}
