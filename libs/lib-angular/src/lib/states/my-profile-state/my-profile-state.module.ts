import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { MyProfileState } from './my-profile.state';

@NgModule({
  imports: [CommonModule, NgxsModule.forFeature([MyProfileState]), ],
})
export class MyProfileStateModule {}
