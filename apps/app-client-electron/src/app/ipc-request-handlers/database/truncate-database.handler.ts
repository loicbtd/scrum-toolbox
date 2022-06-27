import { Application, DatabasesService, dependencies } from '@libraries/lib-electron';
import { IpcRequestHandlerInterface } from '@libraries/lib-electron-web';
import {
  appIpcs,
  ProjectEntity,
  ProjectMemberEntity,
  SprintEntity,
  SprintMemberEntity,
  SprintStatusEntity,
  TaskEntity,
  TaskStatusEntity,
  TaskTypeEntity,
  UserEntity,
} from '@libraries/lib-scrum-toolbox';

export class TruncateDatabaseHandler implements IpcRequestHandlerInterface {
  channel = appIpcs.truncateDatabase;

  async handle(): Promise<void> {
    const connection = Application.getInstance()
      .dependencies.get<DatabasesService>(dependencies.databases)
      .getConnection('main');

    // await connection.getRepository(SprintMemberEntity).clear();
    // await connection.getRepository(ProjectMemberEntity).clear();
    // await connection.getRepository(TaskEntity).clear();
    // await connection.getRepository(SprintEntity).clear();
    // await connection.getRepository(ProjectEntity).clear();
    // await connection.getRepository(UserEntity).clear();
    // await connection.getRepository(TaskTypeEntity).clear();
    // await connection.getRepository(TaskStatusEntity).clear();
    // await connection.getRepository(SprintStatusEntity).clear();
    console.log(await connection.runMigrations());
  }
}
