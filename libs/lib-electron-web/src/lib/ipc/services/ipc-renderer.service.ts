import { IpcRequestHandlerInterface } from '../interfaces/ipc-request-handler.interface';
import { IpcModel } from '../models/ipc.model';
import { IpcRequestInterface } from '../interfaces/ipc-request.interface';
import { IpcResponseInterface } from '../interfaces/ipc-response.interface';

export class IpcRendererService {
  private readonly _ipc: IpcModel;

  private readonly _requestHandlers: IpcRequestHandlerInterface[];

  constructor(document: Document, apiKey = 'electron') {
    this._ipc = (document.defaultView as any)[apiKey];
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
        this._ipc.removeAllListeners(listeningChannel);
      };

      this._ipc.onResponse(listeningChannel, listener);

      this._ipc.send(channel, request);
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
        this._ipc.removeAllListeners(listeningChannel);
        endAction(event as IpcResponseInterface<LastType>);
        return;
      }
      progressAction(event as IpcResponseInterface<ProgressType>);
    };

    this._ipc.onResponse(listeningChannel, listener);

    this._ipc.send(channel, request);
  }

  public addRequestHandler(requestHandler: IpcRequestHandlerInterface): void {
    if (this._requestHandlers.some((_) => _.channel == requestHandler.channel)) {
      return;
    }

    this._ipc.onRequest(requestHandler.channel, (_: any, request: IpcRequestInterface<any>) => {
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

    this._ipc.removeAllListeners(channel);

    this._requestHandlers.filter((_) => !(_.channel == channel));
  }

  private generateUniqueId(): string {
    return Math.random().toString(16).slice(2);
  }
}
