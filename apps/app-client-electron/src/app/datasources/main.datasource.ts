import 'reflect-metadata';

import { TaskType } from '@libraries/lib-scrum-toolbox';
import { homedir } from 'os';
import { join } from 'path';
import { DataSource } from 'typeorm';

export const MainDataSource = new DataSource({
  type: 'better-sqlite3',
  database: join(homedir(), '.scrum-toolbox', 'databases', 'main.db'),
  synchronize: true,
  logging: false,
  entities: [TaskType],
  migrations: [],
  subscribers: [],
});
