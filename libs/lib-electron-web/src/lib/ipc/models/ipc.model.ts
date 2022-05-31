import { contextBridge, ipcRenderer } from 'electron';
import { IpcRequestInterface } from '../interfaces/ipc-request.interface';
import { IpcResponseInterface } from '../interfaces/ipc-response.interface';

export class IpcModel {
  public static Expose(apiKey = 'electron') {
    contextBridge.exposeInMainWorld(apiKey, this);
  }

  onRequest(channel: string, listener: (_: any, response: IpcRequestInterface<any>) => void): void {
    ipcRenderer.on(channel, listener);
  }

  onResponse(channel: string, listener: (_: any, response: IpcResponseInterface<any>) => void): void {
    ipcRenderer.on(channel, listener);
  }

  send(channel: string, request: IpcRequestInterface<any>): void {
    ipcRenderer.send(channel, request);
  }

  removeAllListeners(channel: string): void {
    ipcRenderer.removeAllListeners(channel);
  }
}
