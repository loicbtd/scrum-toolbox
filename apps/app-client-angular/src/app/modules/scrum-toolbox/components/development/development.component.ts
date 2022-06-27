import { Component } from '@angular/core';
import { ToastMessageService } from '@libraries/lib-angular';
import { appIpcs } from '@libraries/lib-scrum-toolbox';
import { IpcService } from '../../../../global/services/ipc.service';
import { ProjectContextService } from '../../services/project-context.service';

@Component({
  template: `
    <p-button
      label="Reload fixtures"
      styleClass="p-button-danger p-button-lg"
      class="m-auto"
      icon="fa-solid fa-circle-exclamation"
      (click)="reloadFixtures()"
    ></p-button>
  `,
  styles: [
    `
      :host {
        width: 100%;
        height: 100%;
        display: flex;
        margin: auto;
      }
    `,
  ],
})
export class DevelopmentComponent {
  constructor(
    private readonly _ipcService: IpcService,
    private readonly _toastMessageService: ToastMessageService,
    private readonly _projectContextService: ProjectContextService
  ) {}

  async reloadFixtures() {
    try {
      await this._ipcService.query(appIpcs.reloadFixtures);
      this._toastMessageService.showSuccess('Fixtures loaded successfully', 'Load Fixtures');
    } catch (error: any) {
      this._toastMessageService.showError(error.message, 'Load Fixtures Failed');
      throw error;
    }

    await this._projectContextService.refreshAvailableProjects();
  }
}
