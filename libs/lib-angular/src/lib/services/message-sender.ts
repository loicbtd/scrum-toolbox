import { ipcRenderer } from 'electron';
import { v4 as uuid } from 'uuid';

export class MessageSender {

  constructor(requestEvent: string) {
    this.requestEvent = requestEvent;
  }

  send(arg = false) {
    return new Promise((resolve, reject) => {
      try {
        const responseEvent = this.newResponseEvent();
        ipcRenderer.once(responseEvent, (event, response) => {
          resolve(response);
        });
        ipcRenderer.send(this.requestEvent, { responseEvent, arg });
      } catch (err) {
        reject(err);
      }
    });
  }

  newResponseEvent() {
    return `${this.}-response-${uuid()}`;
  }
}
