import { homedir } from 'os';
import { join } from 'path';
import { ConnectionOptions } from 'typeorm';
import { environment } from '../../environments/environment';
import { InitializeDatabase1655822535548 } from '../migrations/1655822535548-InitializeDatabase';
import {
  Project,
  Sprint,
  SprintStatus,
  Task,
  TaskStatus,
  TaskType,
  User,
  UserSprint,
  UserType,
  UserUserTypeProject,
} from '@libraries/lib-scrum-toolbox';

export const mainDataSource = {
  type: 'better-sqlite3',
  database: environment.production
    ? join(homedir(), '.scrum-toolbox', 'databases', 'main.db')
    : join('dist', 'main.db'),
  logging: false,
  entities: [
    Project,
    Sprint,
    SprintStatus,
    Task,
    TaskStatus,
    TaskType,
    User,
    UserSprint,
    UserType,
    UserUserTypeProject,
  ],
  migrations: [InitializeDatabase1655822535548],
  migrationsRun: true,
} as ConnectionOptions;
