import { IpcRequestHandlerInterface } from '@libraries/lib-electron-web';

export class TestHandler implements IpcRequestHandlerInterface {
  channel = 'test';

  handle(data: any) {
    console.log('hello from ipcMain');
  }
}
