import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
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

  form = this.fb.group({
    label: ['', [Validators.required]],
    startDate: ['', [Validators.required]],
    endDate: ['', [Validators.required]],
    selectedProject: ['', [Validators.required]],
  });

  sprint: Sprint;
  projects: Project[];
  selectedProject : Project;
  submitted : boolean;
  startWrong : boolean;
  endWrong : boolean;
  minStartDate : Date;
  minEndDate : Date;

  constructor(
    private readonly _toastMessageService: ToastMessageService,
    private readonly _ipcService: IpcService,
    public readonly _router: Router,
    private readonly fb: UntypedFormBuilder,
    ) { }

  async ngOnInit() {
    this.projects = await this._ipcService.query<Project[]>(appIpcs.retrieveAllProjects);
    this.sprint = {};
    this.sprint.status = await this._ipcService.query<SprintStatus>(appIpcs.retrieveSprintStatus, {label: 'CREATED'})
    this.submitted = false;
    this.endWrong = false;
    this.startWrong = false;
    this.minStartDate = new Date();
  }

  async saveSprint() {
    this.submitted = true;
    this.startWrong = false;
    this.endWrong = false;
    this.sprint.label = this.form.get('label')?.value

    if (this.form.invalid) {
      return;
    }

    if(this.form.get('startDate')?.value < new Date('dd/MM/yyyy')){
        this.startWrong = true;
        return;
    }
    if(this.form.get('endDate')?.value < this.form.get('startDate')?.value){
      this.endWrong = true;
      return;
    }

    try {
      this.sprint.start_date = this.form.get('startDate')?.value;
      this.sprint.end_date = this.form.get('endDate')?.value;
      this.sprint.project = new Project();
      this.sprint.project = this.form.get('selectedProject')?.value;

      await this._ipcService.query<Sprint>(appIpcs.createSprint, this.sprint);
      this._toastMessageService.showSuccess('Sprint Created', 'Successful');

    } catch (error: any) {
      this._toastMessageService.showError(error.message, `Error while creating Sprint`);
    }
    this.sprint = new Sprint()
    this.sprint.status = await this._ipcService.query<SprintStatus>(appIpcs.retrieveSprintStatus, {label: 'CREATED'})
    this.form.reset()
    this.submitted = false;
    this.startWrong = false;
    this.endWrong = false;
  }
}
