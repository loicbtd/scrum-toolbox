import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { CurrentProjectState } from './current-project.state';

@NgModule({
  imports: [CommonModule, NgxsModule.forFeature([CurrentProjectState])],
})
export class CurrentProjectStateModule {}
