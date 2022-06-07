import { Injectable } from '@angular/core';
import { User } from '@liraries/lib-scrum-toolbox';
import { UserAlreadyExistsError } from '../errors/user-already-exists.error';
import { UserNotFoundError } from '../errors/user-not-found.error';
import { MainService } from './main.service';

@Injectable({ providedIn: 'root' })
export class UserService extends MainService<User> {
  constructor() {
    super();
    this.repository = this.databaseConnection.getRepository(User);
  }

  private async searchUserByUser(options: any): Promise<User> {
    return this.repository.findOne(options);
  }

  async create(command: User): Promise<User> {
    if (await this.searchUserByUser({ username: command.username })) {
      throw new UserAlreadyExistsError(command.username);
    } else {
      return this.repository.save(command);
    }
  }

  async update(command: User): Promise<void> {
    const user = await this.searchUserByUser({ id: command.id });
    if (user) {
      await this.repository.update(user.id, command);
    } else {
      throw new UserNotFoundError(command.id);
    }
  }

  async delete(command: User): Promise<User> {
    const user = await this.searchUserByUser({ id: command.id });
    if (!user) {
      throw new UserNotFoundError(command.id);
    }
    return this.repository.remove(user);
  }

  async retrieveAll(): Promise<User[]> {
    return this.repository.find();
  }
}
