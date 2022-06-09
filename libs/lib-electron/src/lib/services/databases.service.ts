import { TaskType } from '@libraries/lib-scrum-toolbox';
import { existsSync, mkdirSync } from 'fs';
import { injectable } from 'inversify';
import { dirname, join } from 'path';
import { DataSource } from 'typeorm';
import { Application } from '../application';
import { ElectronApplicationError } from '../errors/electron-application.error';
import { DatabaseConfiguration } from '../interfaces/database-configuration.interface';
import { Database } from '../interfaces/database.interface';

@injectable()
export class DatabasesService {
  private _databases: Database[];

  constructor() {
    this._databases = [];
  }

  public getDataSource(id: string): DataSource {
    const database = this._databases.find((_) => _.id == id);

    if (!database) {
      throw new Error('database does not exist');
    }

    return database.dataSource;
  }

  public async initialize(databaseConfigurations: DatabaseConfiguration[]): Promise<void> {
    if (!databaseConfigurations) {
      throw new ElectronApplicationError('databaseConfigurations is undefined');
    }

    for (const configuration of databaseConfigurations) {
      let databaseDirectoryPath: string[];

      if (configuration.customPath) {
        databaseDirectoryPath = configuration.customPath;
      } else {
        databaseDirectoryPath = [...Application.getInstance().settingsDirectoryPath, 'databases'];
      }

      if (!existsSync(dirname(join(...databaseDirectoryPath)))) {
        mkdirSync(join(...databaseDirectoryPath), { recursive: true });
      }

      const dataSource = new DataSource({
        type: 'better-sqlite3',
        entities: configuration.entities || [],
        database: join(...databaseDirectoryPath, `${configuration.id}.sqlite3`),
        synchronize: true,
      });

      await dataSource.initialize();

      this._databases.push({ id: configuration.id, dataSource: dataSource });
    }
  }
}
