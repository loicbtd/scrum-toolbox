import { Component, EventEmitter, Input, NgModule, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponsiveService } from '../../services/responsive.service';
import { NavigationItemModel } from '../../models/navigation-item.model';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navigation-container',
  template: `
    <ng-container *ngIf="isMobile$ | async; then mobile; else desktop"></ng-container>

    <ng-template #mobile>
      <app-navigation-container-mobile [navigationItems]="navigationItems">
        <ng-content></ng-content>
      </app-navigation-container-mobile>
    </ng-template>

    <ng-template #desktop>
      <app-navigation-container-desktop
        [(desktopNavigationExpanded)]="desktopNavigationExpanded"
        [navigationItems]="navigationItems"
        [avatarNavigationItems]="avatarNavigationItems"
        [avatarImageSource]="avatarImageSource"
        [logoImageSource]="logoImageSource"
        [username]="username"
      >
        <ng-container navigationBarContent><ng-content select="[navigationBarContent]"></ng-content></ng-container>
        <ng-container appContent><ng-content></ng-content></ng-container>
      </app-navigation-container-desktop>
    </ng-template>
  `,
})
export class AppNavigationContainerComponent {
  private _desktopNavigationExpanded = false;

  get isMobile$(): Observable<boolean> {
    return this._responsiveService.isMobile$;
  }

  @Input() navigationItems: NavigationItemModel[] = [];

  @Input() avatarNavigationItems: NavigationItemModel[] = [];

  @Input() logoImageSource = '';

  @Input() avatarImageSource = '';

  @Input() username = '';

  @Input() set desktopNavigationExpanded(value: boolean) {
    this._desktopNavigationExpanded = value;
    this.desktopNavigationExpandedChange.emit(value);
  }

  get desktopNavigationExpanded(): boolean {
    return this._desktopNavigationExpanded;
  }

  @Output() desktopNavigationExpandedChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private readonly _responsiveService: ResponsiveService) {}
}

@Component({
  selector: 'app-navigation-container-mobile',
  template: `<div class="message">Mobile view is not supported</div>`,
  styles: [
    `
      :host {
        height: 100%;
        width: 100%;
        display: flex;
        flex-wrap: wrap;
      }

      .message {
        margin: auto;
      }
    `,
  ],
})
export class AppNavigationContainerMobileComponent extends AppNavigationContainerComponent {
  @Input() navigationItems: NavigationItemModel[];

  _navigationExpanded = false;

  @Input() get navigationExpanded(): boolean {
    return this._navigationExpanded;
  }

  set navigationExpanded(value: boolean) {
    this._navigationExpanded = value;
    this.navigationExpandedChange.emit(value);
  }

  @Output() navigationExpandedChange: EventEmitter<boolean> = new EventEmitter();
}

@Component({
  selector: 'app-navigation-container-desktop',
  template: `
    <nav class="navigation-bar">
      <a class="logo-container" [routerLink]="['/']">
        <img [src]="logoImageSource" alt="application logo" />
      </a>
      <div class="navigation-bar-content">
        <ng-content select="[navigationBarContent]"></ng-content>
      </div>
      <div class="avatar-container">
        <div class="username">{{ username | slice: 0:43 }}</div>
        <div class="avatar">
          <img [src]="avatarImageSource" alt="user avatar" />
        </div>
      </div>
    </nav>
    <nav
      [ngClass]="{
        navigation: true,
        expanded: desktopNavigationExpanded,
        collapsed: !desktopNavigationExpanded
      }"
    >
      <a [routerLink]="item.routerLink" *ngFor="let item of navigationItems" (click)="item.action()">
        <div *ngIf="item.iconClass" class="icon-container">
          <i [class]="item.iconClass"></i>
        </div>
        <div *ngIf="desktopNavigationExpanded && item.label" class="label">{{ item.label | slice: 0:20 }}</div>
      </a>

      <hr class="separator" />

      <div class="expander-button" (click)="desktopNavigationExpanded = !desktopNavigationExpanded">
        <i *ngIf="!desktopNavigationExpanded" class="fa-solid fa-chevron-right"></i>
        <i *ngIf="desktopNavigationExpanded" class="fa-solid fa-chevron-left"></i>
      </div>
    </nav>
    <div
      [ngClass]="{
        'app-container': true,
        'navigation-expanded': desktopNavigationExpanded,
        'navigation-collapsed': !desktopNavigationExpanded
      }"
    >
      <ng-content></ng-content>
    </div>

    <div class="avatar-navigation">
      <a [routerLink]="item.routerLink" *ngFor="let item of avatarNavigationItems" (click)="item.action()">
        <div *ngIf="item.iconClass" class="icon-container">
          <i [class]="item.iconClass"></i>
        </div>
        <div *ngIf="item.label" class="label">{{ item.label | slice: 0:20 }}</div>
      </a>
    </div>
  `,
  styles: [
    `
      :host {
        --navigation-bar-heigth: 50px;
        --navigation-bar-bottom-border-size: 1px;
        --navigation-collapsed-width: 60px;
        --navigation-expanded-width: 220px;
        height: 100%;
        width: 100%;
        display: flex;
        flex-wrap: wrap;
      }

      .navigation-bar {
        width: 100%;
        height: var(--navigation-bar-heigth);
        background-color: #fff;
        border-bottom: var(--navigation-bar-bottom-border-size) solid #575e6a;
        display: flex;
        flex-direction: row;
      }

      .navigation-bar .logo-container {
        padding-left: 10px;
        height: 100%;
        display: flex;
        margin-right: auto;
      }

      .navigation-bar .logo-container img {
        margin: auto;
        height: calc(var(--navigation-bar-heigth) - 20px);
      }

      .navigation-bar-content {
        margin: auto;
      }

      .navigation {
        display: flex;
        flex-direction: column;
        background-color: #575e6a;
        height: calc(100% - calc(var(--navigation-bar-heigth) + var(--navigation-bar-bottom-border-size)));
      }

      .avatar-container {
        margin-left: auto;
        height: 100%;
        display: flex;
        padding-right: 10px;
      }

      .avatar {
        height: calc(var(--navigation-bar-heigth) - 10px);
        width: calc(var(--navigation-bar-heigth) - 10px);
        display: flex;
        border: 1px solid #000;
        border-radius: 50%;
        overflow: hidden;
        margin: auto 0 auto 10px;
      }

      .avatar img {
        height: 100%;
        width: 100%;
        object-fit: cover;
        margin: auto;
      }

      .username {
        margin: auto auto auto 0;
      }

      .navigation.collapsed {
        width: var(--navigation-collapsed-width);
      }

      .navigation.expanded {
        width: var(--navigation-expanded-width);
      }

      .navigation {
        background-color: #575e6a;
        width: 60px;
        height: calc(100% - calc(var(--navigation-bar-heigth) + var(--navigation-bar-bottom-border-size)));
      }

      .navigation {
        background-color: #575e6a;
        height: calc(100% - calc(var(--navigation-bar-heigth) + var(--navigation-bar-bottom-border-size)));
      }

      .navigation.collapsed {
        width: var(--navigation-collapsed-width);
      }

      .navigation.expanded {
        width: var(--navigation-expanded-width);
      }

      .navigation a {
        display: flex;
        align-items: center;
        color: #fff;
        height: 60px;
        margin: 0;
        padding: 0;
        text-decoration: none;
        font-size: 1.2rem;
      }

      .navigation a:hover,
      .navigation a.active {
        background-color: #007bc0;
      }

      .navigation.collapsed a {
        justify-content: center;
      }

      .navigation.expanded a {
        justify-content: left;
        padding-left: 10px;
      }

      .icon-container {
        display: flex;
        align-items: center;
        justify-content: center;
        heigth: 40px;
        width: 40px;
      }

      .navigation i {
        font-size: 25px;
      }

      .app-container.navigation-collapsed {
        width: calc(100% - var(--navigation-collapsed-width));
      }

      .app-container.navigation-expanded {
        width: calc(100% - var(--navigation-expanded-width));
      }

      .separator {
        margin-top: auto;
        border: 1px solid #fff;
        background: #fff;
      }

      .navigation.collapsed .separator {
        width: calc(var(--navigation-collapsed-width) - 20px);
      }

      .navigation.expanded .separator {
        width: calc(var(--navigation-expanded-width) - 20px);
      }

      .expander-button {
        display: flex;
        color: #fff;
        width: 100%;
        height: 40px;
        align-items: center;
        cursor: pointer;
      }

      .collapsed .expander-button i {
        margin: auto;
      }

      .expanded .expander-button i {
        margin: auto 20px auto auto;
      }

      .avatar-navigation {
        position: fixed;
        top: calc(var(--navigation-bar-heigth) + var(--navigation-bar-bottom-border-size));
        right: 10px;
        display: flex;
        flex-direction: column;
        background-color: #fff;
        box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
        min-width: 200px;
      }

      .avatar-navigation a {
        display: flex;
        flex-wrap: no-wrap;
        text-decoration: none;
        color: #000;
        height: 30px;
        align-items: center;
      }

      .avatar-navigation a:hover {
        background-color: #007bc0;
        color: #fff;
      }
    `,
  ],
})
export class AppNavigationContainerDesktopComponent extends AppNavigationContainerComponent {}

@NgModule({
  declarations: [
    AppNavigationContainerComponent,
    AppNavigationContainerDesktopComponent,
    AppNavigationContainerMobileComponent,
  ],
  imports: [CommonModule, RouterModule],
  exports: [
    AppNavigationContainerComponent,
    AppNavigationContainerDesktopComponent,
    AppNavigationContainerMobileComponent,
  ],
})
export class AppNavigationContainerModule {}