import { IpcRequestHandlerInterface, IpcRequestInterface, IpcResponseInterface } from '@libraries/lib-electron-web';

export class IpcEventHandler implements IpcRequestHandlerInterface {
  channel = 'test';

  handle(event: IpcRequestInterface<any>): IpcResponseInterface<any> | Promise<IpcResponseInterface<any>> {
    throw new Error('Method not implemented.');
  }
}
