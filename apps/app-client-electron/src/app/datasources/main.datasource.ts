import { homedir } from 'os';
import { join } from 'path';
import { ConnectionOptions } from 'typeorm';
import { environment } from '../../environments/environment';
import { InitializeDatabase } from '../migrations/initialize-database';
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
import { AddTaskCapacity } from '../migrations/add-task-capacity';
import { AddColosToSprintStatus } from '../migrations/add-colors-sprint-status';

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
  migrations: [InitializeDatabase, AddTaskCapacity, AddColosToSprintStatus],
} as ConnectionOptions;
