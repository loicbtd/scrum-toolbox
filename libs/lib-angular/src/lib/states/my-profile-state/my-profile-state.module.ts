import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { MyProfileState } from './my-profile.state';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';

@NgModule({
  imports: [
    CommonModule,
    NgxsModule.forRoot([MyProfileState]),
    NgxsStoragePluginModule.forRoot({ key: [MyProfileState] }),
  ],
})
export class MyProfileStateModule {}
