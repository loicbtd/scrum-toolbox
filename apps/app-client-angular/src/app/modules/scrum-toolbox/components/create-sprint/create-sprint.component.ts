import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastMessageService } from '@libraries/lib-angular';
import { appIpcs, appRoutes, Project, Sprint, SprintStatus } from '@libraries/lib-scrum-toolbox';
import { IpcService } from 'apps/app-client-angular/src/app/global/services/ipc.service';

@Component({
  selector: 'app-create-sprint',
  templateUrl: './create-sprint.component.html',
  styleUrls: ['./create-sprint.component.scss']
})
export class CreateSprintComponent implements OnInit {

  sprint: Sprint;
  projects: Project[];
  selectedProject : Project;
  startDate: Date;
  endDate: Date;
  submitted : boolean;

  constructor(
    private readonly _toastMessageService: ToastMessageService,
    private readonly _ipcService: IpcService,
    public readonly _router: Router,
    ) { }

  async ngOnInit() {
    this.projects = await this._ipcService.query<Project[]>(appIpcs.retrieveAllProjects);
    this.sprint = {};
    this.sprint.status = await this._ipcService.query<SprintStatus>(appIpcs.retrieveSprintStatus, {label: 'CREATED'})
    this.submitted = false;
  }

  test() : void{
    if(this.submitted){
      this.submitted = false;
    }
    else{
      this.submitted = true;
    }
  }

  async saveSprint() { //TODO: controle date (invalid if < new Date())
    this.submitted = true;

    try {
      this.sprint.start_date = this.startDate.toString();
      this.sprint.end_date = this.endDate.toString();
      this.sprint.project = new Project;
      this.sprint.project = this.selectedProject;

      await this._ipcService.query<Sprint>(appIpcs.createSprint, this.sprint);
      this._toastMessageService.showSuccess('Sprint Created', 'Successful');
      await this._router.navigate([appRoutes.scrumToolbox.administration.root]); //TODO: redirect to sprint backlog

    } catch (error: any) {
      this._toastMessageService.showError(error.message, `Error while creating Sprint`);
    }
  }
}
