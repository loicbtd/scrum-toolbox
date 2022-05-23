import { CommonModule } from '@angular/common';
import { Component, Input, NgModule } from '@angular/core';

@Component({
  selector: 'app-navigation',
  template: `
    <nav class="top-navigation"></nav>
    <nav
      [ngClass]="{
        'left-navigation': true,
        expanded: leftNavigationExpanded,
        collapsed: !leftNavigationExpanded
      }"
    >
      <a [href]="item.routerLink" *ngFor="let item of leftNavigationItems">
        <div class="icon-container">
          <i [class]="item.iconClass"></i>
        </div>
        <div class="label" *ngIf="leftNavigationExpanded">{{ item.label }}</div>
      </a>

      <hr class="separator" />

      <div class="expander-button" (click)="leftNavigationExpanded = !leftNavigationExpanded">
        <i *ngIf="!leftNavigationExpanded" class="fa-solid fa-chevron-right"></i>
        <i *ngIf="leftNavigationExpanded" class="fa-solid fa-chevron-left"></i>
      </div>
    </nav>
    <div
      [ngClass]="{
        'app-container': true,
        'left-navigation-expanded': leftNavigationExpanded,
        'left-navigation-collapsed': !leftNavigationExpanded
      }"
    >
      <ng-content></ng-content>
    </div>
  `,
  styles: [
    `
      :host {
        --top-navigation-heigth: 79px;
        --top-navigation-bottom-border-size: 1px;
        --left-navigation-collapsed-width: 60px;
        --left-navigation-expanded-width: 220px;
        height: 100%;
        width: 100%;
        display: flex;
        flex-wrap: wrap;
      }

      .top-navigation {
        width: 100%;
        height: var(--top-navigation-heigth);
        background-color: #fff;
        border-bottom: var(--top-navigation-bottom-border-size) solid #575e6a;
      }

      .left-navigation {
        display: flex;
        flex-direction: column;
        background-color: #575e6a;
        height: calc(100% - calc(var(--top-navigation-heigth) + var(--top-navigation-bottom-border-size)));
      }

      .left-navigation.collapsed {
        width: var(--left-navigation-collapsed-width);
      }

      .left-navigation.expanded {
        width: var(--left-navigation-expanded-width);
      }

      .left-navigation {
        background-color: #575e6a;
        width: 60px;
        height: calc(100% - calc(var(--top-navigation-heigth) + var(--top-navigation-bottom-border-size)));
      }

      .left-navigation {
        background-color: #575e6a;
        height: calc(100% - calc(var(--top-navigation-heigth) + var(--top-navigation-bottom-border-size)));
      }

      .left-navigation.collapsed {
        width: var(--left-navigation-collapsed-width);
      }

      .left-navigation.expanded {
        width: var(--left-navigation-expanded-width);
      }

      .left-navigation a {
        display: flex;
        align-items: center;
        color: #fff;
        height: 60px;
        margin: 0;
        padding: 0;
        text-decoration: none;
        font-size: 1.2rem;
      }

      .left-navigation a:hover,
      .left-navigation a.active {
        background-color: #007bc0;
      }

      .left-navigation.collapsed a {
        justify-content: center;
      }

      .left-navigation.expanded a {
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

      .left-navigation i {
        font-size: 25px;
      }

      .app-container.left-navigation-collapsed {
        width: calc(100% - var(--left-navigation-collapsed-width));
      }

      .app-container.left-navigation-expanded {
        width: calc(100% - var(--left-navigation-expanded-width));
      }

      .separator {
        margin-top: auto;
        border-top: 1px solid #fff;
      }

      .left-navigation.collapsed .separator {
        width: calc(var(--left-navigation-collapsed-width) - 40px);
      }

      .left-navigation.expanded .separator {
        width: calc(var(--left-navigation-expanded-width) - 20px);
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
export class NavigationComponent {
  @Input() leftNavigationItems: MenuItem[];

  @Input() leftNavigationExpanded = false;
}

@NgModule({
  imports: [CommonModule],
  declarations: [NavigationComponent],
  exports: [NavigationComponent],
})
export class NavigationModule {}

export class MenuItem {
  label?: string;
  iconClass?: string;
  routerLink: string;
}
