import { NgModule, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared.module';
import { Component } from '@angular/core';
import { IpcService } from '../../global/services/ipc.service';
import { appIpcs } from '@libraries/lib-scrum-toolbox';

@Component({
  template: `
    <div style="height: 100vh; width: 100vw; overflow: hidden" class="flex flex-column" (click)="reloadFixtures()">
      <div class="m-auto flex flex-column">
        <img src="assets/images/icon.ico" height="60px" width="60px" alt="" class="mx-auto" draggable="false" />
        <div class="mx-auto font-bold text-blue-900 mt-1">{{ appTitle }}</div>
        <small class="mx-auto mt-2 text-blue-900">{{ version }}</small>
      </div>
    </div>
  `,
})
export class StartupComponent implements OnInit {
  version = '';

  appTitle = 'Scrum Toolbox';

  constructor(private readonly _ipcService: IpcService) {}

  async ngOnInit() {
    this.version = await this._ipcService.query<string>(appIpcs.getAppVersion);
  }

  async reloadFixtures() {
    await this._ipcService.query<string>(appIpcs.reloadFixtures);
  }
}

@NgModule({
  declarations: [StartupComponent],
  providers: [StartupModule],
  imports: [
    SharedModule,
    RouterModule.forChild([
      {
        path: '',
        component: StartupComponent,
      },
      {
        path: '**',
        redirectTo: '',
      },
    ]),
  ],
})
export class StartupModule {}
