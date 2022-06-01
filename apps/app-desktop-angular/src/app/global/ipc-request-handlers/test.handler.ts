import { IpcRequestHandlerInterface, IpcRequestInterface, IpcResponseInterface } from '@libraries/lib-electron-web';

export class TestHandler implements IpcRequestHandlerInterface {
  channel = 'string';

  handle(event: IpcRequestInterface<any>): IpcResponseInterface<any> {
    console.log('hello from test handler');

    return {};
  }
}
