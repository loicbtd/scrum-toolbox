import { IpcRequestHandlerInterface, IpcRequestInterface, IpcResponseInterface } from '@libraries/lib-electron-web';

export class TestHandler implements IpcRequestHandlerInterface {
  channel = 'test';

  handle(event: IpcRequestInterface<any>): IpcResponseInterface<any> {
    console.log('hello from ipcMain');

    return {};
  }
}
