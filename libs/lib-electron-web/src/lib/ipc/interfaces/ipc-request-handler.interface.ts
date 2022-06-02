export interface IpcRequestHandlerInterface {
  channel: string;

  handle(data: any): Promise<any> | any;
}
