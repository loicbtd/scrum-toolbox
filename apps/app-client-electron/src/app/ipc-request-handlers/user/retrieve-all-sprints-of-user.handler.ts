import { Application, DatabasesService, dependencies } from '@libraries/lib-electron';
import { IpcRequestHandlerInterface } from '@libraries/lib-electron-web';
import { appIpcs, SprintEntity } from '@libraries/lib-scrum-toolbox';

export class RetrieveAllSprintsOfUser implements IpcRequestHandlerInterface {
  channel = appIpcs.retrieveAllSprintsOfUser;

  async handle(data: { userId: string; projectId: string }): Promise<SprintEntity[]> {
    return Application.getInstance()
      .dependencies.get<DatabasesService>(dependencies.databases)
      .getConnection('main')
      .createQueryBuilder()
      .select('s.id', 'id')
      .addSelect('s.label', 'label')
      .addSelect('s.start_date', 'start_date')
      .addSelect('s.end_date', 'end_date')
      .addSelect('s.label', 'label')
      .distinct(true)
      .from('user_sprint', 'us')
      .leftJoin('sprint', 's')
      .where('s.project.id = :projectId', { projectId: data.projectId })
      .andWhere('us.user.id = :userId', { userId: data.userId })
      .execute();
  }
}
