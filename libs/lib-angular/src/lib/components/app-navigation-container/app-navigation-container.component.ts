import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { NavigationItemModel } from './navigation-item.model';

@Component({
  selector: 'app-navigation-container',
  template: `
    <ng-container *ngIf="isMobile | async; then mobile; else desktop"></ng-container>

    <ng-template #mobile>
      <app-navigation-container-mobile [navigationItems]="navigationItems">
        <ng-content></ng-content>
      </app-navigation-container-mobile>
    </ng-template>

    <ng-template #desktop>
      <app-navigation-container-desktop [(navigationExpanded)]="navigationExpanded" [navigationItems]="navigationItems">
        <ng-container navigationBarContent><ng-content select="[navigationBarContent]"></ng-content></ng-container>
        <ng-container appContent><ng-content select="[appContent]"></ng-content></ng-container>
      </app-navigation-container-desktop>
    </ng-template>
  `,
})
export class AppNavigationContainerComponent {
  private readonly _isMobile: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  private _navigationExpanded = false;

  get isMobile(): Observable<boolean> {
    return this._isMobile.asObservable();
  }

  @Input() mobileBreakpoint = 960;

  @Input() navigationItems: NavigationItemModel[];

  @Input() set navigationExpanded(value: boolean) {
    this._navigationExpanded = value;
    this.navigationExpandedChange.emit(value);
  }

  get navigationExpanded(): boolean {
    return this._navigationExpanded;
  }

  @Output() navigationExpandedChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  @HostListener('window:resize')
  updateScreenSize() {
    let width = document.querySelector('body')?.offsetWidth;

    console.log(width);

    if (!width) {
      width = window.innerWidth;
    }

    this._isMobile.next(width < this.mobileBreakpoint);
  }
}
