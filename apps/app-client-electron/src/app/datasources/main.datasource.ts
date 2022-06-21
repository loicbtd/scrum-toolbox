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
import { homedir } from 'os';
import { join } from 'path';
import { DataSourceOptions } from 'typeorm';

export function getDataSource() {
  return {
    type: 'better-sqlite3',
    database: join(homedir(), '.scrum-toolbox', 'databases', 'main.db'),
    synchronize: false,
    entities: [
      TaskType,
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
    ],
  } as DataSourceOptions;
}
