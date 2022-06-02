import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class ToastMessageService {
  toastElementId = 'global-toast';

  constructor(private readonly _messageService: MessageService) {}

  showSuccess(message: string, title = 'Success') {
    this._messageService.add({ key: this.toastElementId, severity: 'success', summary: title, detail: message });
  }

  showInfo(message: string, title = 'Information') {
    this._messageService.add({ key: this.toastElementId, severity: 'info', summary: title, detail: message });
  }

  showWarning(message: string, title = 'Warning') {
    this._messageService.add({ key: this.toastElementId, severity: 'warn', summary: title, detail: message });
  }

  showError(message: string, title = 'Error') {
    this._messageService.add({ key: this.toastElementId, severity: 'error', summary: title, detail: message });
  }
}
