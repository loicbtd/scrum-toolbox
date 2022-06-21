import { existsSync, mkdirSync } from 'fs';
import { injectable } from 'inversify';
import { dirname, join } from 'path';
import { DataSource } from 'typeorm';
import { ElectronApplicationError } from '../errors/electron-application.error';
import { DatabaseConfigurationInterface } from '../interfaces/database-configuration.interface';
import { DatabaseInterface } from '../interfaces/database.interface';

@injectable()
export class DatabasesService {
  private _databases: DatabaseInterface[];

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

  public async initialize(databaseConfigurations: DatabaseConfigurationInterface[]): Promise<void> {
    if (!databaseConfigurations) {
      throw new ElectronApplicationError('databaseConfigurations is undefined');
    }

    for (const configuration of databaseConfigurations) {
      if (
        configuration.dataSourceOptions.type === 'sqlite' ||
        configuration.dataSourceOptions.type == 'better-sqlite3'
      ) {
        if (!existsSync(dirname(configuration.dataSourceOptions.database))) {
          mkdirSync(dirname(configuration.dataSourceOptions.database), { recursive: true });
        }
      }

      const dataSource = new DataSource(configuration.dataSourceOptions);

      try {
        await dataSource.initialize();
        this._databases.push({ id: configuration.id, dataSource: dataSource });
      } catch (error: any) {
        throw new ElectronApplicationError('unable to initialize dataSource');
      }
    }
  }
}
