export interface IpcResponseInterface<T> {
  data: T;

  errorMessage: string;

  nextExpected: boolean;
}
