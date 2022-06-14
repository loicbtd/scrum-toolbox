export class BaseError extends Error {
  constructor(errorMessage: string) {
    super(errorMessage);
  }
}
