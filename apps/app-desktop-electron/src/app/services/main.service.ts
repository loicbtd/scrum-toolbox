import { Application } from '@libraries/lib-electron';
import { Repository } from 'typeorm';

export abstract class MainService<T> {
  repository: Repository<T>;
  databaseConnection = Application.getInstance().monitoringToolDatabaseConnection;
  abstract create(command: T): T | Promise<T>;
  abstract update(command: T): void;
  abstract delete(command: T): T | Promise<T>;
}
