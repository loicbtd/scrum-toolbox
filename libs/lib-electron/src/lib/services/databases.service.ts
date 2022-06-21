import { existsSync, mkdirSync } from 'fs';
import { injectable } from 'inversify';
import { dirname, join } from 'path';
import { DataSource } from 'typeorm';
import { Application } from '../application';
import { ElectronApplicationError } from '../errors/electron-application.error';
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

  public async initialize(databases: Database[]): Promise<void> {
    if (!databases) {
      throw new ElectronApplicationError('databaseConfigurations is undefined');
    }

    for (const database of databases) {
      if (database.dataSource.options.type === 'sqlite' || database.dataSource.options.type == 'better-sqlite3') {
        if (!existsSync(dirname(database.dataSource.options.database))) {
          mkdirSync(dirname(database.dataSource.options.database), { recursive: true });
        }
      }

      await database.dataSource.initialize();

      this._databases.push(database);
    }
  }
}
