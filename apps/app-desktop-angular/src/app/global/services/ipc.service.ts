import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { IpcRendererService } from '@libraries/lib-electron-web';
import { TestHandler } from '../ipc-request-handlers/test.handler';

@Injectable({
  providedIn: 'root',
})
export class IpcService extends IpcRendererService {
  constructor(@Inject(DOCUMENT) document: Document) {
    super(document);

    super.addRequestHandler(new TestHandler());
  }
}
