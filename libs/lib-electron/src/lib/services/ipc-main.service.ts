import { IpcRequestHandlerInterface, IpcRequestInterface, IpcResponseInterface } from '@libraries/lib-electron-web';
import { ipcMain, ipcRenderer } from 'electron';
import { IpcMainEvent } from 'electron/main';
import { Application } from '../application';

export class IpcMainService {
  private readonly _requestHandlers: IpcRequestHandlerInterface[];

  // public static Expose(apiKey = 'electron') {
  //   contextBridge.exposeInMainWorld(apiKey, {
  //     onRequest(channel: string, listener: (_: any, response: IpcRequestInterface<any>) => void): void {
  //       ipcRenderer.on(channel, listener);
  //     },
  //     onResponse(channel: string, listener: (_: any, response: IpcResponseInterface<any>) => void): void {
  //       ipcRenderer.on(channel, listener);
  //     },
  //     send(channel: string, request: IpcRequestInterface<any>): void {
  //       ipcRenderer.send(channel, request);
  //     },
  //     removeAllListeners(channel: string): void {
  //       ipcRenderer.removeAllListeners(channel);
  //     },
  //   } as IpcInterface);
  // }

  constructor() {
    this._requestHandlers = [];
  }

  public async query<T>(channel: string, data?: any): Promise<T> {
    const uniqueId = this.generateUniqueId();

    const listeningChannel = `${channel} ${uniqueId}`;

    const request: IpcRequestInterface<any> = { id: uniqueId, data: data };

    return await new Promise<T>((resolve, reject) => {
      const listener = (_: any, event: IpcResponseInterface<T>) => {
        if (event.errorMessage) {
          reject(new Error(event.errorMessage));
        } else {
          resolve(event.data);
        }
        ipcMain.removeAllListeners(listeningChannel);
      };

      ipcMain.on(listeningChannel, listener);

      for (const window of Application.getInstance().windows) {
        window.webContents.send(channel, request);
      }
    });
  }

  public subscribe<ProgressType, LastType>(
    channel: string,
    data?: any,
    progressAction?: (progressData: ProgressType) => void,
    endAction?: (lastData: LastType) => void
  ) {
    const uniqueId = this.generateUniqueId();

    const listeningChannel = `${channel} ${uniqueId}`;

    const request: IpcRequestInterface<any> = { id: uniqueId, data: data };

    const listener = (_: any, response: IpcResponseInterface<ProgressType | LastType>) => {
      if (response.errorMessage) {
        throw new Error(response.errorMessage);
      }

      if (!response.nextExpected) {
        ipcMain.removeAllListeners(listeningChannel);
        if (endAction) {
          endAction(response.data as LastType);
        }
        return;
      }

      if (progressAction) {
        progressAction(response.data as ProgressType);
      }
    };

    ipcMain.on(listeningChannel, listener);

    ipcMain.emit(channel, request);
  }

  public addRequestHandler(handlerType: new () => IpcRequestHandlerInterface): void {
    const handler = new handlerType();

    if (this._requestHandlers.some((_) => _.channel == handler.channel)) {
      return;
    }

    ipcMain.on(handler.channel, (event: IpcMainEvent, request: IpcRequestInterface<any>) => {
      event.sender.send(`${handler.channel} ${request.id}`, handler.handle(request.data));
    });

    this._requestHandlers.push(handler);
  }

  public addRequestHandlers(handlerTypes: (new () => IpcRequestHandlerInterface)[]): void {
    for (const handlerType of handlerTypes) {
      this.addRequestHandler(handlerType);
    }
  }

  public removeRequestHandler(handlerType: new () => IpcRequestHandlerInterface): void {
    const handler = new handlerType();

    if (!this._requestHandlers.some((_) => _.channel == handler.channel)) {
      return;
    }

    ipcMain.removeAllListeners(handler.channel);

    this._requestHandlers.filter((_) => !(_.channel == handler.channel));
  }

  public removeRequestHandlers(handlerTypes: (new () => IpcRequestHandlerInterface)[]): void {
    for (const handlerType of handlerTypes) {
      this.removeRequestHandler(handlerType);
    }
  }

  private generateUniqueId(): string {
    return Math.random().toString(16).slice(2);
  }
}
