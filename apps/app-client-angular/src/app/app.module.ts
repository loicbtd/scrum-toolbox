import { NgModule, OnInit } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { SharedModule } from './shared.module';
import { Component } from '@angular/core';
import { BlockUiService } from './global/services/block-ui.service';
import { appRoutes } from '@libraries/lib-scrum-toolbox';
import { LoginComponent } from './modules/login/login.component';
import {
  IsAuthenticatedGuard,
  IsNotAuthenticatedGuard,
  MyProfileService,
  MyProfileState,
  MyProfileStateModule,
  VisitedRoutesStateModule,
} from '@libraries/lib-angular';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { NgxsModule } from '@ngxs/store';
import { IpcService } from './global/services/ipc.service';
import { SignUpComponent } from './modules/signup/signup.component';

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
  constructor(private readonly _blockUiService: BlockUiService, _ipcService: IpcService) {}

  get $uiBlocked() {
    return this._blockUiService.$uiBlocked;
  }
}

@NgModule({
  declarations: [AppComponent, LoginComponent, SignUpComponent],
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
          canActivate: [IsAuthenticatedGuard],
          data: { redirectionPath: [appRoutes.login] },
        },
        {
          path: appRoutes.login,
          component: LoginComponent,
          canActivate: [IsNotAuthenticatedGuard],
        },
        {
          path: appRoutes.signup,
          component: SignUpComponent,
        },
        {
          path: '**',
          redirectTo: appRoutes.scrumToolbox.root,
        },
      ],
      { initialNavigation: 'enabledBlocking', useHash: true }
    ),
    SharedModule,
    NgxsModule.forRoot(),
    NgxsStoragePluginModule.forRoot({ key: [MyProfileState] }),
    MyProfileStateModule,
    VisitedRoutesStateModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
