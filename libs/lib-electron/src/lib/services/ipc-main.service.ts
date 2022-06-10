import { IpcRequestHandlerInterface, IpcRequestInterface, IpcResponseInterface } from '@libraries/lib-electron-web';
import { ipcMain } from 'electron';
import { IpcMainEvent } from 'electron/main';
import { injectable } from 'inversify';
import { Application } from '../application';

@injectable()
export class IpcMainService {
  private readonly _requestHandlers: IpcRequestHandlerInterface[];

  constructor() {
    this._requestHandlers = [];
  }

  public async query<T>(channel: string, data?: any): Promise<T> {
    const uniqueId = this.generateUniqueId();

    const listeningChannel = `${channel} ${uniqueId}`;

    const request: IpcRequestInterface<any> = { id: uniqueId, data: data };

    return new Promise<T>((resolve, reject) => {
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
  ): void {
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

  public addRequestHandler(handlerType: new (...args: any[]) => IpcRequestHandlerInterface): void {
    const handler = new handlerType();

    if (this._requestHandlers.some((_) => _.channel == handler.channel)) {
      return;
    }

    ipcMain.on(handler.channel, async (event: IpcMainEvent, request: IpcRequestInterface<any>) => {
      const response: IpcResponseInterface<any> = {};

      try {
        response.data = handler.handle(request.data);
      } catch (error: any) {
        response.data = undefined;
        response.errorMessage = error.message;
      }

      if (typeof response.data === 'object' && typeof response.data.then === 'function') {
        try {
          response.data = await response.data;
        } catch (error: any) {
          response.data = undefined;
          response.errorMessage = error.message;
        }
      }

      console.log('here');

      console.log(response);

      event.sender.send(`${handler.channel} ${request.id}`, response);
    });

    this._requestHandlers.push(handler);
  }

  public addRequestHandlers(handlerTypes: (new (...args: any[]) => IpcRequestHandlerInterface)[]): void {
    for (const handlerType of handlerTypes) {
      this.addRequestHandler(handlerType);
    }
  }

  public removeRequestHandler(handlerType: new (...args: any[]) => IpcRequestHandlerInterface): void {
    const handler = new handlerType();

    if (!this._requestHandlers.some((_) => _.channel == handler.channel)) {
      return;
    }

    ipcMain.removeAllListeners(handler.channel);

    this._requestHandlers.filter((_) => !(_.channel == handler.channel));
  }

  public removeRequestHandlers(handlerTypes: (new (...args: any[]) => IpcRequestHandlerInterface)[]): void {
    for (const handlerType of handlerTypes) {
      this.removeRequestHandler(handlerType);
    }
  }

  private generateUniqueId(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c == 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
}
