import { Repository } from 'typeorm';

export abstract class BaseService<T> {


  repository: Repository<T>;

  abstract create(command: T): T | Promise<T>;
  abstract update(command: T): void;
  abstract delete(command: T): T | Promise<T>;
}
