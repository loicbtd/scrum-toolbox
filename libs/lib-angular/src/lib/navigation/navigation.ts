import { CommonModule } from '@angular/common';
import { Component, Input, NgModule } from '@angular/core';

@Component({
  selector: 'app-navigation',
  template: `
    <nav class="top-navigation"></nav>
    <nav class="left-navigation">
      <a [href]="item.routerLink" *ngFor="let item of leftNavigationItems">
        <i [class]="item.iconClass"></i>
        <div *ngIf="leftNavigationExpanded">{{ item.label }}</div>
      </a>
    </nav>
    <div class="app-container">
      <ng-content></ng-content>
    </div>
  `,
  styles: [
    `
      :host {
        --top-navigation-heigth: 79px;
        --top-navigation-bottom-border-size: 1px;
        --left-navigation-width: 60px;
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
      /* #007bc0 */
      .left-navigation {
        background-color: #575e6a;
        width: 60px;
        height: calc(100% - calc(var(--top-navigation-heigth) + var(--top-navigation-bottom-border-size)));
      }

      .left-navigation a {
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        height: 60px;
        margin: 0;
      }

      .left-navigation i {
        font-size: 40px;
      }

      .app-container {
        width: calc(100% - var(--left-navigation-width));
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
