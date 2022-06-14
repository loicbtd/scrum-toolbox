import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { VisitedRoutesState } from './visited-routes.state';

@NgModule({
  imports: [
    CommonModule,
    NgxsModule.forRoot([VisitedRoutesState]),
    NgxsStoragePluginModule.forRoot({ key: [VisitedRoutesState] }),
  ],
})
export class VisitedRoutesStateModule {}
