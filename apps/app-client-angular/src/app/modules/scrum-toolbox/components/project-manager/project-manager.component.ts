import { Component, OnInit } from '@angular/core';
import { Project } from '@libraries/lib-scrum-toolbox';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ProjectManagerService } from '../services/project-manager.service';

@Component({
  selector: 'app-project-manager',
  templateUrl: './project-manager.component.html',
  styleUrls: ['./project-manager.component.scss'],
  providers: [MessageService,ConfirmationService]
})
export class ProjectManagerComponent implements OnInit {

  projectDialog: boolean;

  projects: Project[];

  project: Project;

  selectedProjects: Project[];

  submitted: boolean;

  statuses: any[];
  constructor(private projectService: ProjectManagerService, private messageService: MessageService, private confirmationService: ConfirmationService) { }

  ngOnInit() {
    this.projectService.retriveAllProject().then(data => this.projects = data);

    this.statuses = [
        {label: 'INSTOCK', value: 'instock'},
        {label: 'LOWSTOCK', value: 'lowstock'},
        {label: 'OUTOFSTOCK', value: 'outofstock'}
    ];
  }

  openNew() {
      this.project = {};
      this.submitted = false;
      this.projectDialog = true;
  }

  deleteSelectedProjects() {
      this.confirmationService.confirm({
          message: 'Are you sure you want to delete the selected projects?',
          header: 'Confirm',
          icon: 'pi pi-exclamation-triangle',
          accept: () => {
              this.projects = this.projects.filter(val => !this.selectedProjects.includes(val));
              this.selectedProjects = [];
              this.messageService.add({severity:'success', summary: 'Successful', detail: 'Projects Deleted', life: 3000});
          }
      });
  }

  editProject(project: Project) {
      this.project = {...project};
      this.projectDialog = true;
  }

  deleteProject(project: Project) {
      this.confirmationService.confirm({
          message: 'Are you sure you want to delete ' + project.label + '?',
          header: 'Confirm',
          icon: 'pi pi-exclamation-triangle',
          accept: () => {
              this.projects = this.projects.filter(val => val.id !== project.id);
              this.project = {};
              this.messageService.add({severity:'success', summary: 'Successful', detail: 'Project Deleted', life: 3000});
          }
      });
  }

  hideDialog() {
      this.projectDialog = false;
      this.submitted = false;
  }

  saveProject() {
      this.submitted = true;

      if (this.project.label?.trim()) {
          if (this.project.id) {
              this.projects[this.findIndexById(this.project.id)] = this.project;
              this.messageService.add({severity:'success', summary: 'Successful', detail: 'Project Updated', life: 3000});
          }
          else {
              this.project.id = this.createId();
              this.project.description = "No one description";
              this.projects.push(this.project);
              this.messageService.add({severity:'success', summary: 'Successful', detail: 'Project Created', life: 3000});
          }

          this.projects = [...this.projects];
          this.projectDialog = false;
          this.project = {};
      }
  }

  findIndexById(id: string): number {
      let index = -1;
      for (let i = 0; i < this.projects.length; i++) {
          if (this.projects[i].id === id) {
              index = i;
              break;
          }
      }

      return index;
  }

  createId(): string{
    let id = '';
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for ( var i = 0; i < 5; i++ ) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  }
}
