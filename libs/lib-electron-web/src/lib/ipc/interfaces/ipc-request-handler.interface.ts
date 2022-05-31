import { IpcRequestInterface } from './ipc-request.interface';
import { IpcResponseInterface } from './ipc-response.interface';

export interface IpcRequestHandlerInterface {
  channel: string;

  handle(event: IpcRequestInterface<any>): Promise<IpcResponseInterface<any>> | IpcResponseInterface<any>;
}
