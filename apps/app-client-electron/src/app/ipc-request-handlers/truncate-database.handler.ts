import { Application, DatabasesService, dependencies } from '@libraries/lib-electron';
import { IpcRequestHandlerInterface } from '@libraries/lib-electron-web';
import {
  appIpcs,
  SprintMemberEntity,
  TaskEntity,
  SprintEntity,
  ProjectEntity,
  UserEntity,
  TaskTypeEntity,
  TaskStatusEntity,
  SprintStatusEntity,
  ProjectMemberEntity,
} from '@libraries/lib-scrum-toolbox';

export class TruncateDatabaseHandler implements IpcRequestHandlerInterface {
  channel = appIpcs.truncateDatabase;

  async handle(): Promise<void> {
    const connection = Application.getInstance()
      .dependencies.get<DatabasesService>(dependencies.databases)
      .getConnection('main');
    const entities = [
      ProjectMemberEntity,
      SprintMemberEntity,
      TaskEntity,
      SprintEntity,
      ProjectEntity,
      UserEntity,
      TaskTypeEntity,
      TaskStatusEntity,
      SprintStatusEntity,
    ];
    for (const entity of entities) {
      await connection.getRepository(entity).clear();
    }
  }
}
