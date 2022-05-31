import { IpcRequestHandlerInterface } from '@libraries/lib-electron-web';
import { ipcMain } from 'electron';

export class IpcMainService {
  // public setEventHandler(eventHandler: IpcRequestHandlerInterface): void {
  //   this.unsetEventHandler(eventHandler.channel);
  //   ipcMain.handle(eventHandler.channel, async (_event, data: EventInterface) => {
  //     return await eventHandler.handle(data);
  //   });
  // }
  // public unsetEventHandler(channel: string): void {
  //   ipcMain.removeHandler(channel);
  // }
}
