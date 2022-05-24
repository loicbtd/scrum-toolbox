import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponsiveService } from '../../services/responsive.service';
import { NavigationItemModel } from '../../models/navigation-item.model';

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
