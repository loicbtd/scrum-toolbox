import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { IpcRendererService } from '@libraries/lib-electron-web';

@Injectable({
  providedIn: 'root',
})
export class IpcService extends IpcRendererService {
  constructor(@Inject(DOCUMENT) document: Document) {
    super(document);
  }
}
