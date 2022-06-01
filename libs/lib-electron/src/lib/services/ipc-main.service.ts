import { IpcRequestHandlerInterface, IpcRequestInterface, IpcResponseInterface } from '@libraries/lib-electron-web';
import { ipcMain } from 'electron';

export class IpcMainService {
  private readonly _requestHandlers: IpcRequestHandlerInterface[];

  constructor() {
    this._requestHandlers = [];
  }

  public async query<T>(channel: string, data: any): Promise<IpcResponseInterface<T>> {
    const uniqueId = this.generateUniqueId();

    const listeningChannel = `${channel} ${uniqueId}`;

    const request: IpcRequestInterface<any> = { id: uniqueId, data: data };

    return await new Promise<IpcResponseInterface<T>>((resolve, reject) => {
      const listener = (_: any, event: IpcResponseInterface<T>) => {
        if (event.errorMessage) {
          reject(new Error(event.errorMessage));
        } else {
          resolve(event);
        }
        ipcMain.removeAllListeners(listeningChannel);
      };

      ipcMain.on(listeningChannel, listener);

      ipcMain.emit(channel, request);
    });
  }

  public subscribe<ProgressType, LastType>(
    channel: string,
    data?: any,
    progressAction?: (event: IpcResponseInterface<ProgressType>) => void,
    endAction?: (data: IpcResponseInterface<LastType>) => void
  ) {
    const uniqueId = this.generateUniqueId();

    const listeningChannel = `${channel} ${uniqueId}`;

    const request: IpcRequestInterface<any> = { id: uniqueId, data: data };

    const listener = (_: any, event: IpcResponseInterface<ProgressType | LastType>) => {
      if (!event.nextExpected) {
        ipcMain.removeAllListeners(listeningChannel);
        endAction(event as IpcResponseInterface<LastType>);
        return;
      }
      progressAction(event as IpcResponseInterface<ProgressType>);
    };

    ipcMain.on(listeningChannel, listener);

    ipcMain.emit(channel, request);
  }

  public addRequestHandler(requestHandler: IpcRequestHandlerInterface): void {
    if (this._requestHandlers.some((_) => _.channel == requestHandler.channel)) {
      return;
    }

    ipcMain.on(requestHandler.channel, (_: any, request: IpcRequestInterface<any>) => {
      requestHandler.handle(request);
    });

    this._requestHandlers.push(requestHandler);
  }

  public addRequestHandlers(requestHandlers: IpcRequestHandlerInterface[]): void {
    for (const requestHandler of requestHandlers) {
      this.addRequestHandler(requestHandler);
    }
  }

  public removeRequestHandler(channel: string): void {
    if (!this._requestHandlers.some((_) => _.channel == channel)) {
      return;
    }

    ipcMain.removeAllListeners(channel);

    this._requestHandlers.filter((_) => !(_.channel == channel));
  }

  private generateUniqueId(): string {
    return Math.random().toString(16).slice(2);
  }

  // public setEventHandler(eventHandler: IpcRequestHandlerInterface): void {
  //   this.unsetEventHandler(eventHandler.channel);
  //   ipcMain.handle(eventHandler.channel, async (_event, data: EventInterface) => {
  //     return await eventHandler.handle(data);
  //   });
  // }
  // public unsetEventHandler(channel: string): void {
  //   ipcMain.removeHandler(channel);
  // }
  // ipcMain.on(IpcChannels.common.ASK_CONFIRMATION_BY_DIALOG, async (event, message: string) => {
  //   const ipcResponse = new IpcResponseModel<boolean>();
  //   try {
  //     ipcResponse.data =
  //       (
  //         await dialog.showMessageBox({
  //           title: 'Confirmation',
  //           message: message,
  //           buttons: ['No', 'Yes'],
  //         })
  //       ).response === 1;
  //   } catch (error) {
  //     ipcResponse.data = error.message;
  //   }
  //   event.sender.send(IpcChannels.common.ASK_CONFIRMATION_BY_DIALOG, ipcResponse);
  // });
}
