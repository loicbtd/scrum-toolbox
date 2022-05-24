import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppNavigationContainerDesktopComponent } from './app-navigation-container-desktop.component';
import { AppNavigationContainerMobileComponent } from './app-navigation-container-mobile.component';
import { AppNavigationContainerComponent } from './app-navigation-container.component';

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
