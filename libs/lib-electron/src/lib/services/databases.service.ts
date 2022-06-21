import { existsSync, mkdirSync } from 'fs';
import { injectable } from 'inversify';
import { dirname } from 'path';
import { Connection } from 'typeorm';
import { ElectronApplicationError } from '../errors/electron-application.error';
import { DatabaseConfigurationInterface } from '../interfaces/database-configuration.interface';
import { DatabaseInterface } from '../interfaces/database.interface';

@injectable()
export class DatabasesService {
  private _databases: DatabaseInterface[];

  constructor() {
    this._databases = [];
  }

  public getConnection(id: string): Connection {
    const database = this._databases.find((_) => _.id == id);

    if (!database) {
      throw new Error('database does not exist');
    }

    return database.connection;
  }

  public async initialize(databaseConfigurations: DatabaseConfigurationInterface[]): Promise<void> {
    if (!databaseConfigurations) {
      throw new ElectronApplicationError('databaseConfigurations is undefined');
    }

    for (const configuration of databaseConfigurations) {
      if (
        configuration.connectionOptions.type === 'sqlite' ||
        configuration.connectionOptions.type == 'better-sqlite3'
      ) {
        if (!existsSync(dirname(configuration.connectionOptions.database))) {
          mkdirSync(dirname(configuration.connectionOptions.database), { recursive: true });
        }
      }

      const connection = new Connection(configuration.connectionOptions);

      try {
        await connection.connect();

        try {
          await connection.runMigrations();
        } catch (error: any) {
          console.error('unable to run migrations');
        }

        this._databases.push({ id: configuration.id, connection: connection });
      } catch (error: any) {
        throw new ElectronApplicationError(`unable to initialize connection ${error.message}`);
      }
    }
  }
}
