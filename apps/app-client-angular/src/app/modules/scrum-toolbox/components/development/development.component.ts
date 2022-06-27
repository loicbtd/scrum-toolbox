import { Component } from '@angular/core';
import { ToastMessageService } from '@libraries/lib-angular';
import { appIpcs, ProjectEntity } from '@libraries/lib-scrum-toolbox';
import { Store } from '@ngxs/store';
import { lastValueFrom } from 'rxjs';
import { IpcService } from '../../../../global/services/ipc.service';
import { RefreshAvailableProjects } from '../../store/actions/project-context.actions';

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
    private readonly _store: Store
  ) {}

  async reloadFixtures() {
    try {
      await this._ipcService.query(appIpcs.reloadFixtures);
      this._toastMessageService.showSuccess('Fixtures loaded successfully', 'Load Fixtures');
    } catch (error: any) {
      this._toastMessageService.showError(error.message, 'Load Fixtures Failed');
      throw error;
    }

    await lastValueFrom(
      this._store.dispatch(
        new RefreshAvailableProjects(await this._ipcService.query<ProjectEntity[]>(appIpcs.retrieveAllProjects))
      )
    );
  }
}
