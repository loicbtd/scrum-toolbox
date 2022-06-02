import { IpcInterface, IpcRequestInterface } from '@libraries/lib-electron-web';
import { contextBridge, ipcRenderer } from 'electron';
import { IpcRendererEvent } from 'electron/main';

contextBridge.exposeInMainWorld('electron', {
  on(channel: string, listener: (event: IpcRendererEvent, request: IpcRequestInterface<any>) => void): void {
    ipcRenderer.on(channel, listener);
  },

  send(channel: string, request: IpcRequestInterface<any>): void {
    ipcRenderer.send(channel, request);
  },

  removeAllListeners(channel: string): void {
    ipcRenderer.removeAllListeners(channel);
  },
} as IpcInterface);
