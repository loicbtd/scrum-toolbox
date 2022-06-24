import { Component } from '@angular/core';
import { CurrentProjectState, MyProfileState, ToastMessageService } from '@libraries/lib-angular';
import { appIpcs, Project, Sprint, SprintStatus, User, UserModel } from '@libraries/lib-scrum-toolbox';
import { IpcService } from '../../../../global/services/ipc.service';
import { ConfirmationService } from 'primeng/api';
import { Select, Store } from '@ngxs/store';
import { MyProfileModel } from '../../../../global/models/my-profile.model';
import { Observable, Subscription } from 'rxjs';
import { CurrentProjectModel } from '../../../../global/models/current-project.model';
import { UntypedFormBuilder, Validators } from '@angular/forms';

@Component({
  templateUrl: './crud-sprint.component.html',
  styleUrls: ['./crud-sprint.component.scss'],
})
export class CrudSprintComponent {
  @Select(CurrentProjectState) currentProject$: Observable<CurrentProjectModel>;

  dialogNew: boolean;
  dialogUpdate: boolean;

  items: Sprint[];
  item: Sprint;

  selectedItems: Sprint[];

  selectedProject: Project;

  submitted: boolean;

  sub: Subscription;


  form = this.fb.group({
    label: ['', [Validators.required]],
    startDate: ['', [Validators.required]],
    endDate: ['', [Validators.required]],
    selectedProjectForm: ['', [Validators.required]],
  });

  sprint: Sprint;

  projects: Project[];
  selectedProjectForm: Project;

  startWrong : boolean;
  endWrong : boolean;
  minStartDate : Date;
  minEndDate : Date;

  sprintStatus: SprintStatus[];


  get isCreationMode() {
    return !this.item.id;
  }

  constructor(
    private readonly _toastMessageService: ToastMessageService,
    private readonly _confirmationService: ConfirmationService,
    private readonly _ipcService: IpcService,
    private readonly _store: Store,
    private readonly fb: UntypedFormBuilder
  ) {}

  async ngOnInit() {

    this.projects = await this._ipcService.query<Project[]>(appIpcs.retrieveAllProjects);
    this.sprintStatus = await this._ipcService.query<SprintStatus[]>(appIpcs.retrieveAllSprintsStatus);

    this.sub = this.currentProject$.subscribe(async (data: CurrentProjectModel) => {
      if (data) {
        
        this.selectedProject = data.project;
    
        this.items = await this._ipcService.query<Sprint[]>(appIpcs.retrieveAllSprintsByProject, {
          id: this.selectedProject.id,
        });
        this.item = this.items[0];
        
      }
    });
    
  }

  openNew() {
    this.item = {};
    this.submitted = false;
    this.dialogNew = true;
  }

  deleteSelectedItems() {
    this._confirmationService.confirm({
      message: 'Are you sure you want to delete the selected items?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        for (const item of this.selectedItems) {

          try {

            await this._ipcService.query(appIpcs.deleteSprint, {id: item.id});

          } catch (error) {
            this._toastMessageService.showError('Error while deleting item');
          }
        }

        this.selectedItems = [];

        this._toastMessageService.showSuccess('Items Deleted', 'Successful');

        this.refresh();

      },
    });
  }

  editItem(item: Sprint) {
    this.item = { ...item };
    this.selectedProjectForm = this.selectedProject;
    this.dialogUpdate = true;
  }

  async deleteItem(item: Sprint) {
    
    this._confirmationService.confirm({
      message: 'Are you sure you want to delete the item ?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        try {
          await this._ipcService.query(appIpcs.deleteSprint, {id: item.id});
          
          this._toastMessageService.showSuccess('Item Deleted', 'Successful');

          this.refresh();

        } catch (error) {
          this._toastMessageService.showError(`Error while deleting item`);
        }
      },
    });

  }

  hideDialog() {
    this.dialogUpdate = false;
    this.dialogNew = false;
    this.submitted = false;
  }

  async saveItem() {
    this.submitted = true;

    if (this.item.id) {
      try {
        await this._ipcService.query(appIpcs.updateUser, this.item);
        this.items[this.findIndexById(this.item.id)] = this.item;
        this._toastMessageService.showSuccess('Item Updated', 'Successful');
      } catch (error: any) {
        this._toastMessageService.showError(error.message, `Error while updating item`);
      }
    } else {
      try {

        this.item.project = this.selectedProjectForm;

        this.item = await this._ipcService.query<Sprint>(appIpcs.createSprint);
        
        this._toastMessageService.showSuccess('Item Created', 'Successful');

        this.refresh();

      } catch (error: any) {

        this._toastMessageService.showError(error.message, `Error while creating item`);

      }
    }

    this.items = [...this.items];
    this.dialogUpdate = false;
    this.dialogNew = false;
    this.item = {};
  }
  
  refresh() {
    this.sub.unsubscribe();
    this.ngOnInit();
  }

  findIndexById(id: string): number {
    let index = -1;
    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  }

  selectColorStatus(it: any): object {
    return { 'background-color': it.status.backgroundColor, color: it.status.textColor };
  }

  async saveSprint() {
    this.submitted = true;
    this.startWrong = false;
    this.endWrong = false;

    if (this.form.invalid) {
      this.submitted = false;
      return;
    }

    this.sprint = new Sprint();
    this.sprint.label = this.form.get('label')?.value

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

      this.sprint.project = this.selectedProject;
      this.sprint.status = this.sprintStatus.find((status) => { return status.label === this.sprintStatus[0].label});

      await this._ipcService.query<Sprint>(appIpcs.createSprint, this.sprint);

      this._toastMessageService.showSuccess('Sprint Created', 'Successful');
        
      this.form.reset()
      this.submitted = false;
      this.startWrong = false;
      this.endWrong = false;

      this.hideDialog();

      this.refresh();

    } catch (error: any) {
      this._toastMessageService.showError(error.message, `Error while creating Sprint`);
    }


  }

}
