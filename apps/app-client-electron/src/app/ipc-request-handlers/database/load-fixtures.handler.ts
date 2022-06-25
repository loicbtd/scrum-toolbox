import { Application, DatabasesService, dependencies } from '@libraries/lib-electron';
import { IpcRequestHandlerInterface } from '@libraries/lib-electron-web';
import { appIpcs } from '@libraries/lib-scrum-toolbox';
import { join } from 'path';
import { Builder, fixturesIterator, Loader, Parser, Resolver } from 'typeorm-fixtures-cli/dist';

export class LoadFixturesHandler implements IpcRequestHandlerInterface {
  channel = appIpcs.loadFixtures;

  async handle(): Promise<void> {
    const connection = Application.getInstance()
      .dependencies.get<DatabasesService>(dependencies.databases)
      .getConnection('main');

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
