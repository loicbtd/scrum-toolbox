import { BaseError } from './base.error';

export class UserAlreadyExistsError extends BaseError {
  constructor(username: string) {
    super(`User ${username} already exists in database`);
  }
}
