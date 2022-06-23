import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { ProjectsUpdatedState } from './projects-updated.state';

@NgModule({
  imports: [CommonModule, NgxsModule.forFeature([ProjectsUpdatedState])],
})
export class ProjectUpdatedStateModule {}
