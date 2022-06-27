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
import { InitializeDatabase1656337596981 } from '../migrations/1656337596981-InitializeDatabase';
import { AddDeleteCascadeBehavior1656351758773 } from '../migrations/1656351758773-AddDeleteCascadeBehavior';

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
  migrations: [],
} as ConnectionOptions;
