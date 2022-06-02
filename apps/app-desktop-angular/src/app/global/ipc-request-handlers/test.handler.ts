import { IpcRequestHandlerInterface } from '@libraries/lib-electron-web';

export class TestHandler implements IpcRequestHandlerInterface {
  channel = 'test2';

  handle(data: string) {
    console.log(data);
  }
}
