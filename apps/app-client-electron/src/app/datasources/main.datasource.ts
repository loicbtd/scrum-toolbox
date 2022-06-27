import { homedir } from 'os';
import { join } from 'path';
import { ConnectionOptions } from 'typeorm';
import { environment } from '../../environments/environment';
import {
  ProjectEntity,
  SprintEntity,
  SprintStatusEntity,
  TaskEntity,
  TaskStatusEntity,
  TaskTypeEntity,
  UserEntity,
  SprintMemberEntity,
  ProjectMemberEntity,
} from '@libraries/lib-scrum-toolbox';
import { InitializeDatabase1656359035473 } from '../migrations/1656359035473-InitializeDatabase';

export const mainDataSource = {
  type: 'better-sqlite3',
  database: environment.production
    ? join(homedir(), '.scrum-toolbox', 'databases', 'main.db')
    : join('dist', 'main.db'),
  entities: [
    ProjectEntity,
    SprintEntity,
    SprintStatusEntity,
    TaskEntity,
    TaskStatusEntity,
    TaskTypeEntity,
    UserEntity,
    SprintMemberEntity,
    ProjectMemberEntity,
  ],
  synchronize: true,
  migrations: [InitializeDatabase1656359035473],
} as ConnectionOptions;
