import { IpcRequestInterface } from './ipc-request.interface';
import { IpcResponseInterface } from './ipc-response.interface';

export interface IpcInterface {
  onRequest(channel: string, listener: (_: any, response: IpcRequestInterface<any>) => void): void;

  onResponse(channel: string, listener: (_: any, response: IpcResponseInterface<any>) => void): void;

  send(channel: string, request: IpcRequestInterface<any>): void;

  removeAllListeners(channel: string): void;
}
