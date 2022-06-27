import { homedir } from 'os';
import { join } from 'path';
import { ConnectionOptions } from 'typeorm';
import { environment } from '../../environments/environment';
import { InitializeDatabase1 } from '../migrations/1-initialize-database';
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
import { AddTaskCapacity2 } from '../migrations/2-add-task-capacity';
import { AddColosToSprintStatus3 } from '../migrations/3-add-colors-sprint-status';
import { UpgradeToNewSchema4 } from '../migrations/4-UpgradeToNewSchema';
import { RenameUserTable5 } from '../migrations/5-RenameUserTable';
import { UpdateEntities6 } from '../migrations/6-UpdateEntities';
import { UpdateTaskEntity7 } from '../migrations/7-UpdateTaskEntity';
import { InitializeDatabase1656337596981 } from '../migrations/1656337596981-InitializeDatabase';

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
  migrations: [InitializeDatabase1656337596981],
} as ConnectionOptions;
