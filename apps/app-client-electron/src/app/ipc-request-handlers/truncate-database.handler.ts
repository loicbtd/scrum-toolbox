import { Application, DatabasesService, dependencies } from '@libraries/lib-electron';
import { IpcRequestHandlerInterface } from '@libraries/lib-electron-web';
import {
  appIpcs,
  UserSprint,
  Task,
  Sprint,
  Project,
  User,
  UserType,
  TaskType,
  TaskStatus,
  SprintStatus,
  UserUserTypeProject,
} from '@libraries/lib-scrum-toolbox';

export class TruncateDatabaseHandler implements IpcRequestHandlerInterface {
  channel = appIpcs.truncateDatabase;

  async handle(): Promise<void> {
    const connection = Application.getInstance()
      .dependencies.get<DatabasesService>(dependencies.databases)
      .getDataSource('main');
    const entities = [
      UserUserTypeProject,
      UserSprint,
      Task,
      Sprint,
      Project,
      User,
      UserType,
      TaskType,
      TaskStatus,
      SprintStatus,
    ];
    for (const entity of entities) {
      await connection.getRepository(entity).clear();
    }
  }
}
