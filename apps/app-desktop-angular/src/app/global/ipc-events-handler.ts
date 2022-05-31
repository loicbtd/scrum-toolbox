import { EventInterface, EventHandlerInterface } from '@libraries/lib-electron';

export class IpcEventHandler implements EventHandlerInterface {
  public handle(event: EventInterface): Promise<EventInterface> | EventInterface {
    switch (event.eventType) {
      case 'getVersionResponse':
        return { eventType: 'getVersionRequest', data: environment.version };
    }
  }
}
