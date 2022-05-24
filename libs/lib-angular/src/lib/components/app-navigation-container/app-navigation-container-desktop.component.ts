import { Component } from '@angular/core';
import { AppNavigationContainerComponent } from './app-navigation-container.component';

@Component({
  selector: 'app-navigation-container-desktop',
  template: `
    <nav class="navigation-bar">
      <a class="logo-container" [routerLink]="['#']">
        <img src="https://bibliotheque.utbm.fr/wp-content/uploads/2015/04/logo_utbm_seul.png" alt="application logo" />
      </a>
      <div class="navigation-bar-content">
        <ng-content select="[navigationBarContent]"></ng-content>
      </div>
      <div class="avatar-container">
        <div class="avatar">
          <img src="https://cdn.pixabay.com/photo/2016/04/01/10/11/avatar-1299805_960_720.png" alt="user avatar" />
        </div>
      </div>
    </nav>
    <nav
      [ngClass]="{
        navigation: true,
        expanded: navigationExpanded,
        collapsed: !navigationExpanded
      }"
    >
      <a [routerLink]="item.routerLink" *ngFor="let item of navigationItems">
        <div class="icon-container">
          <i [class]="item.iconClass"></i>
        </div>
        <div class="label" *ngIf="navigationExpanded">{{ item.label }}</div>
      </a>

      <hr class="separator" />

      <div class="expander-button" (click)="navigationExpanded = !navigationExpanded">
        <i *ngIf="!navigationExpanded" class="fa-solid fa-chevron-right"></i>
        <i *ngIf="navigationExpanded" class="fa-solid fa-chevron-left"></i>
      </div>
    </nav>
    <div
      [ngClass]="{
        'app-container': true,
        'navigation-expanded': navigationExpanded,
        'navigation-collapsed': !navigationExpanded
      }"
    >
      <ng-content select="[appContent]"></ng-content>
    </div>
  `,
  styles: [
    `
      :host {
        --navigation-bar-heigth: 79px;
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
        height: 100%;
        width: 100px;
        display: flex;
      }

      .navigation-bar .logo-container img {
        margin: auto;
        height: 60px;
        width: 60px;
      }

      .navigation-bar-content {
        margin-left: auto;
        margin-right: auto;
      }

      .navigation {
        display: flex;
        flex-direction: column;
        background-color: #575e6a;
        height: calc(100% - calc(var(--navigation-bar-heigth) + var(--navigation-bar-bottom-border-size)));
      }

      .avatar-container {
        margin-left: auto;
      }

      .avatar-container {
        margin-left: auto;
      }

      .avatar img {
        height: 20px;
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
        border-top: 1px solid #fff;
      }

      .navigation.collapsed .separator {
        width: calc(var(--navigation-collapsed-width) - 40px);
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

      .collapsed .expander-button {
        justify-content: center;
      }

      .expanded .expander-button {
        justify-content: right;
      }

      .expanded .expander-button i {
        margin-right: 15px;
      }
    `,
  ],
})
export class AppNavigationContainerDesktopComponent extends AppNavigationContainerComponent {}
