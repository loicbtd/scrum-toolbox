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
import { join } from 'path';
import { Builder, fixturesIterator, Loader, Parser, Resolver } from 'typeorm-fixtures-cli/dist';

export class ReloadFixturesHandler implements IpcRequestHandlerInterface {
  channel = appIpcs.reloadFixtures;

  async handle(): Promise<void> {
    const connection = Application.getInstance()
      .dependencies.get<DatabasesService>(dependencies.databases)
      .getConnection('main');

    await connection.getRepository(SprintMemberEntity).clear();
    await connection.getRepository(ProjectMemberEntity).clear();
    await connection.getRepository(TaskEntity).clear();
    await connection.getRepository(SprintEntity).clear();
    await connection.getRepository(ProjectEntity).clear();
    await connection.getRepository(UserEntity).clear();
    await connection.getRepository(TaskTypeEntity).clear();
    await connection.getRepository(TaskStatusEntity).clear();
    await connection.getRepository(SprintStatusEntity).clear();

    await connection.runMigrations();

    const loader = new Loader();
    loader.load(join(__dirname, 'assets', 'fixtures'));

    const resolver = new Resolver();
    const fixtures = resolver.resolve(loader.fixtureConfigs);
    const builder = new Builder(connection, new Parser());

    for (const fixture of fixturesIterator(fixtures)) {
      const entity = await builder.build(fixture);

      await connection.getRepository(entity.constructor.name).save(entity);
    }
  }
}
