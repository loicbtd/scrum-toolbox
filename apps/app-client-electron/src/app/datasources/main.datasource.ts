import { homedir } from 'os';
import { join } from 'path';
import { ConnectionOptions } from 'typeorm';
import { environment } from '../../environments/environment';
import { TaskType } from '@libraries/lib-scrum-toolbox';
import { InitializeDatabase1655822535548 } from '../migrations/1655822535548-InitializeDatabase';

export const MainDataSource = {
  type: 'better-sqlite3',
  database: environment.production
    ? join(homedir(), '.scrum-toolbox', 'databases', 'main.db')
    : join('dist', 'main.db'),
  logging: false,
  entities: [TaskType],
  migrations: [InitializeDatabase1655822535548],
  migrationsRun: true,
} as ConnectionOptions;
