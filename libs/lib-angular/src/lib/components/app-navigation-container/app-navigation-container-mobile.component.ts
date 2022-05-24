import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NavigationItemModel } from './navigation-item.model';

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
export class AppNavigationContainerMobileComponent {
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
