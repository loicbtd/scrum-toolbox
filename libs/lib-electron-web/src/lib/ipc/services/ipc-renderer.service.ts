import { IpcRequestHandlerInterface } from '../interfaces/ipc-request-handler.interface';
import { IpcRequestInterface } from '../interfaces/ipc-request.interface';
import { IpcResponseInterface } from '../interfaces/ipc-response.interface';
import { IpcInterface } from '../interfaces/ipc.interface';

export class IpcRendererService {
  private readonly _ipc: IpcInterface;

  private readonly _requestHandlers: IpcRequestHandlerInterface[];

  constructor(document: Document, apiKey = 'electron') {
    this._ipc = (document.defaultView as any)[apiKey];
    this._requestHandlers = [];
  }

  public async query<T>(channel: string, data?: any): Promise<T> {
    const uniqueId = this.generateUniqueId();

    const listeningChannel = `${channel} ${uniqueId}`;

    const request: IpcRequestInterface<any> = { id: uniqueId, data: data };
    console.log('PROMISE');
    return new Promise<T>((resolve, reject) => {
      const listener = (_: any, response: IpcResponseInterface<T>) => {
        if (response?.errorMessage) {
          console.log('REJECT');
          reject(new Error(response.errorMessage));
        } else {
          console.log('RESOLVE');
          resolve(response?.data as T);
        }

        this._ipc.removeAllListeners(listeningChannel);
      };

      this._ipc.on(listeningChannel, listener);

      this._ipc.send(channel, request);
    });
  }

  public subscribe<ProgressType, LastType>(
    channel: string,
    data?: any,
    progressAction?: (progressData: ProgressType) => void,
    endAction?: (lastData: LastType) => void
  ) {
    const uniqueId = this.generateUniqueId();

    const listeningChannel = `${channel} ${uniqueId}`;

    const request: IpcRequestInterface<any> = { id: uniqueId, data: data };

    const listener = (_: any, response: IpcResponseInterface<ProgressType | LastType>) => {
      if (response.errorMessage) {
        throw new Error(response.errorMessage);
      }

      if (!response.nextExpected) {
        this._ipc.removeAllListeners(listeningChannel);

        if (endAction) {
          endAction(response.data as LastType);
        }

        return;
      }

      if (progressAction) {
        progressAction(response.data as ProgressType);
      }
    };

    this._ipc.on(listeningChannel, listener);

    this._ipc.send(channel, request);
  }

  public addRequestHandler(handlerType: new () => IpcRequestHandlerInterface): void {
    const handler = new handlerType();

    if (this._requestHandlers.some((_) => _.channel == handler.channel)) {
      return;
    }

    this._ipc.on(handler.channel, async (event, request) => {
      event.sender.send(`${handler.channel} ${request.id}`, await handler.handle(request.data));
    });

    this._requestHandlers.push(handler);
  }

  public addRequestHandlers(handlerTypes: (new () => IpcRequestHandlerInterface)[]): void {
    for (const handlerType of handlerTypes) {
      this.addRequestHandler(handlerType);
    }
  }

  public removeRequestHandler(handlerType: new () => IpcRequestHandlerInterface): void {
    const handler = new handlerType();

    if (!this._requestHandlers.some((_) => _.channel == handler.channel)) {
      return;
    }

    this._ipc.removeAllListeners(handler.channel);

    this._requestHandlers.filter((_) => !(_.channel == handler.channel));
  }

  public removeRequestHandlers(handlerTypes: (new () => IpcRequestHandlerInterface)[]): void {
    for (const handlerType of handlerTypes) {
      this.removeRequestHandler(handlerType);
    }
  }

  private generateUniqueId(): string {
    return Math.random().toString(16).slice(2);
  }
}
