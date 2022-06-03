import {
  User,
  Project,
  Sprint,
  SprintStatus,
  Task,
  TaskStatus,
  UserSprint,
  UserType,
  UserUserTypeProject,
  TaskType,
} from '@liraries/lib-scrum-toolbox';
import { existsSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { Connection, ConnectionManager } from 'typeorm';
import { ElectronApplicationError } from '../errors/electron-application.error';

const ENTITIES = [
  User,
  Sprint,
  Project,
  UserSprint,
  SprintStatus,
  UserType,
  UserUserTypeProject,
  Task,
  TaskStatus,
  TaskType,
];

export class DatabasesService {
  databasesPath: string[];

  constructor(settingsPath: string[]) {
    if (!settingsPath) {
      throw new ElectronApplicationError('settingsPath is undefined');
    }

    this.databasesPath = [...settingsPath, 'databases'];

    if (!existsSync(dirname(join(...this.databasesPath)))) {
      mkdirSync(join(...this.databasesPath), { recursive: true });
    }
  }

  public async getConnection(databaseName: string): Promise<Connection> {
    const connection = new ConnectionManager().create({
      type: 'better-sqlite3',
      database: join(...this.databasesPath, `${databaseName}.sqlite3`),
      entities: ENTITIES,
      synchronize: true,
    });

    await connection.connect();

    return connection;
  }
}
