import { ConnectionOptions } from 'typeorm';
import { TaskType } from '../entities/task-type.entity';

export const MainDataSource = {
  type: 'better-sqlite3',
  database: '.scrum-toolbox/databases/main.db',
  synchronize: true,
  logging: false,
  entities: [TaskType],
  migrations: [],
  subscribers: [],
} as ConnectionOptions;
