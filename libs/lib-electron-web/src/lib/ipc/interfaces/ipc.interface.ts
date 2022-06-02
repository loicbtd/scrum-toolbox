import { IpcRendererEvent } from 'electron';
import { IpcRequestInterface } from './ipc-request.interface';

export interface IpcInterface {
  on(channel: string, listener: (event: IpcRendererEvent, ipcRequest: IpcRequestInterface<any>) => void): void;

  send(channel: string, ipcRequest: IpcRequestInterface<any>): void;

  removeAllListeners(channel: string): void;
}
