import { BaseError } from './base.error';

export class UserNotFoundError extends BaseError {
  constructor(username: string) {
    super(`User ${username} not found`);
  }
}
