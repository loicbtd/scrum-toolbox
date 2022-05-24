import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { SharedModule } from './shared.module';
import { appRoutes } from '@libraries/lib-common';
import { Component } from '@angular/core';
import { BlockUiService } from './global/services/block-ui.service';

@Component({
  selector: 'app-root',
  template: `
    <blockablediv class="flex" #blockableDiv>
      <div class="main-frame">
        <router-outlet></router-outlet>
      </div>
    </blockablediv>

    <p-toast key="global-toast" [preventOpenDuplicates]="true"></p-toast>

    <ng-container *ngIf="$uiBlocked | async as uiBlocked">
      <p-blockUI [target]="blockableDiv" [baseZIndex]="50000" [blocked]="uiBlocked">
        <div class="ui-blocker"></div>
      </p-blockUI>
    </ng-container>
  `,
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(private readonly _blockUiService: BlockUiService) {}

  get $uiBlocked() {
    return this._blockUiService.$uiBlocked;
  }
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(
      [
        {
          path: appRoutes.startup.root,
          loadChildren: () => import('./modules/startup/startup.module').then((_) => _.StartupModule),
        },
        {
          path: appRoutes.scrumToolbox.root,
          loadChildren: () => import('./modules/scrum-toolbox/scrum-toolbox.module').then((_) => _.ScrumToolboxModule),
        },
        {
          path: '**',
          redirectTo: appRoutes.scrumToolbox.root,
        },
      ],
      { initialNavigation: 'enabledBlocking', useHash: true }
    ),
    SharedModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
