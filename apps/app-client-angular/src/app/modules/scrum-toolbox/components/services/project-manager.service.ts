import { Injectable } from "@angular/core";
import { appIpcs, Project } from "@libraries/lib-scrum-toolbox";
import { IpcService } from "apps/app-client-angular/src/app/global/services/ipc.service";

@Injectable({
  providedIn: 'root'
})
export class ProjectManagerService{

  constructor(private readonly _ipcService: IpcService) {}


  async createProject(){
    const project = new Project();
    project.label = 'ProjetTest';
    project.description = 'Une description'
    project.createdAt = new Date();

    await this._ipcService.query(appIpcs.createProject, project);
  }

  async retriveAllProject(){
    const p: Project[] = await this._ipcService.query(appIpcs.retrieveAllProjects);
    console.log(p);
    return p;
  }
}
