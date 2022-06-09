import { DatabasesService, dependencies } from '@libraries/lib-electron';
import { User } from '@libraries/lib-scrum-toolbox';
import { inject, injectable } from 'inversify';
import { Repository } from 'typeorm';
import { UserAlreadyExistsError } from '../errors/user-already-exists.error';
import { UserNotFoundError } from '../errors/user-not-found.error';

@injectable()
export class UsersService {
  private readonly _repository: Repository<User>;

  constructor(@inject(dependencies.databases) databaseService: DatabasesService) {
    this._repository = databaseService.getDataSource('main').getRepository(User);
  }

  private async searchUserByUser(options: any): Promise<User> {
    return this._repository.findOne(options);
  }

  async create(command: User): Promise<User> {
    if (await this.searchUserByUser({ username: command.username })) {
      throw new UserAlreadyExistsError(command.username);
    } else {
      return await this._repository.save(command);
    }
  }

  async update(command: User): Promise<void> {
    const user = await this.searchUserByUser({ id: command.id });
    if (user) {
      await this._repository.update(user.id, command);
    } else {
      throw new UserNotFoundError(command.id);
    }
  }

  async delete(command: User): Promise<void> {
    const user = await this.searchUserByUser({ id: command.id });
    if (!user) {
      throw new UserNotFoundError(command.id);
    }
    await this._repository.remove(user);
  }

  async retrieveAll(): Promise<User[]> {
    return await this._repository.find();
  }
}
