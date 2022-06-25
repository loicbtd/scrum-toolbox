import { Component } from '@angular/core';
import { CurrentProjectState, ToastMessageService } from '@libraries/lib-angular';
import {
  appIpcs,
  ProjectEntity,
  SprintEntity,
  SprintStatusEntity,
  TaskEntity,
  TaskStatusEntity,
  TaskTypeEntity,
  UserEntity,
  UserModel,
} from '@libraries/lib-scrum-toolbox';
import { Select } from '@ngxs/store';
import { CurrentProjectModel } from '../../../../global/models/current-project.model';
import { Observable } from 'rxjs';
import { IpcService } from '../../../../global/services/ipc.service';

@Component({
  templateUrl: './development.component.html',
})
export class DevelopmentComponent {
  currentUser!: UserEntity;

  @Select(CurrentProjectState) currentProject$: Observable<CurrentProjectModel>;

  title?: string;

  constructor(private readonly _ipcService: IpcService, private readonly toastMessageService: ToastMessageService) {}

  ngOnInit(): void {
    this.testObserver();
  }

  async createUserUserEntity() {
    const u = new UserEntity();
    u.username = 'titi';
    u.firstname = 'Toto';
    u.lastname = 'TITI';
    u.password = 'password';
    this.currentUser = await this._ipcService.query<UserEntity>(appIpcs.createUser, u);
  }

  updateUser() {
    this._ipcService.query(appIpcs.updateUser, {
      id: this.currentUser.id,
      firstname: 'Tartenpion',
    });
  }
  deleteUser() {
    this._ipcService.query(appIpcs.deleteUser, {
      id: this.currentUser.id,
    });
  }

  async retrieveAllUsers() {
    console.log(await this._ipcService.query(appIpcs.retrieveAllUsers));
  }

  async retrieveUser() {
    const user = await this._ipcService.query<UserModel>(appIpcs.retrieveUser, {
      id: 'f6a88420-b92f-45cc-83d4-a4a39979ffad',
    });
    console.log(user.username);
  }

  async activateUser() {
    await this._ipcService.query(appIpcs.updateStatusUser, { id: this.currentUser.id, isActivated: true });
  }

  async deactivateUser() {
    await this._ipcService.query(appIpcs.updateStatusUser, { id: this.currentUser.id, isActivated: false });
  }

  async login() {
    await this._ipcService.query(appIpcs.login, {});
  }

  async createTask() {
    const taskType = await this.retrieveAllTaskType();
    const taskStatus = await this.retrieveAllTaskStatus();
    const t = new TaskEntity();
    t.label = 'ISSUE';
    t.status = taskStatus[Math.floor(Math.random() * taskStatus.length)];
    t.type = taskType[Math.floor(Math.random() * taskType.length)];
    t.description = 'lorem ipsum dolor sit amet, consectetur adipis';
    const task = await this._ipcService.query(appIpcs.createTask, t);
    console.log(task);
  }

  async retrieveAllTaskStatus(): Promise<TaskStatusEntity[]> {
    return this._ipcService.query(appIpcs.retrieveAllTasksStatus);
  }

  async retrieveAllTaskType(): Promise<TaskTypeEntity[]> {
    return this._ipcService.query(appIpcs.retrieveAllTasksType);
  }

  async retrieveTask(): Promise<TaskTypeEntity[]> {
    return this._ipcService.query(appIpcs.retrieveTask, { id: '806f847c-318c-412a-ab38-ab7649b8b1c2' });
  }

  async retrieveAllTasks() {
    console.log(await this._ipcService.query(appIpcs.retrieveAllTasks));
  }

  async assignTaskToUser() {
    await this._ipcService.query(appIpcs.assignTaskToUser, {
      taskId: 'c365e2e8-ac9f-4239-85d6-2b60e0e2ca36',
      userId: 'ccce153a-fd3c-47cf-8d67-f6da3dfda16e',
    });
  }
  async assignTaskToSprint() {
    await this._ipcService.query(appIpcs.assignTaskToSprint, {
      taskId: 'c365e2e8-ac9f-4239-85d6-2b60e0e2ca36',
      sprintId: '5b93ebb9-ee28-4ac3-af7b-8141178762f9',
    });
  }

  async createProject() {
    const p = new ProjectEntity();
    p.label = 'test';
    p.description = 'test';
    await this._ipcService.query(appIpcs.createProject, p);
  }

  async retrieveAllProjects(): Promise<ProjectEntity[]> {
    const p: ProjectEntity[] = await this._ipcService.query(appIpcs.retrieveAllProjects);
    console.log(p);
    return p;
  }

  async updateProject() {
    await this._ipcService.query(appIpcs.updateProject, {
      id: '5b93ebb9-ee28-4ac3-af7b-8141178762f9',
      label: 'test',
    });
  }

  async deleteProject() {
    await this._ipcService.query(appIpcs.deleteProject, {
      id: '5b93ebb9-ee28-4ac3-af7b-8141178762f9',
    });
  }

  async retrieveProject(): Promise<ProjectEntity> {
    const p: ProjectEntity = await this._ipcService.query(appIpcs.retrieveProject, {
      id: '5b93ebb9-ee28-4ac3-af7b-8141178762f9',
    });
    console.log(p);
    return p;
  }

  async createSprintStatus() {
    const sprintStatus = new SprintStatusEntity();
    sprintStatus.label = 'CREATED';
    await this._ipcService.query(appIpcs.createSprintStatus, sprintStatus);
  }

  async deleteSprintStatus() {
    await this._ipcService.query(appIpcs.deleteSprintStatus, { id: '5b93ebb9-ee28-4ac3-af7b-8141178762f9' });
  }

  async updateSprintStatus() {
    await this._ipcService.query(appIpcs.updateSprintStatus, {
      id: '5b93ebb9-ee28-4ac3-af7b-8141178762f9',
      label: 'DONE',
    });
  }

  async retrieveAllSprintStatus(): Promise<SprintStatusEntity[]> {
    return await this._ipcService.query(appIpcs.retrieveAllSprintsStatus);
  }

  async retrieveSprintStatus() {
    console.log(
      await this._ipcService.query(appIpcs.retrieveSprintStatus, { id: '5b93ebb9-ee28-4ac3-af7b-8141178762f9' })
    );
  }

  async createSprint() {
    const sprint = new SprintEntity();
    sprint.label = 'Sprint 1';
    sprint.start_date = new Date().toString();
    sprint.end_date = new Date().toString();
    sprint.project = new ProjectEntity();
    sprint.project = (await this.retrieveAllProjects())[0];
    sprint.status = (await this.retrieveAllSprintStatus())[0];

    await this._ipcService.query(appIpcs.createSprint, sprint);
  }

  async retrieveSprint() {
    console.log(await this._ipcService.query(appIpcs.retrieveSprint));
  }

  async retrieveAllSprints() {
    console.log(await this._ipcService.query(appIpcs.retrieveAllSprints));
  }

  async retrieveAllSprintsByProject() {
    console.log(
      await this._ipcService.query(appIpcs.retrieveAllSprintsByProject, {
        id: '314674f2-947c-4c9f-9580-d4ce8ffa5632',
      })
    );
  }

  async deleteSprint() {
    await this._ipcService.query(appIpcs.deleteSprint, { id: '5b93ebb9-ee28-4ac3-af7b-8141178762f9' });
  }

  async updateSprint() {
    await this._ipcService.query(appIpcs.updateSprint, {
      id: '5b93ebb9-ee28-4ac3-af7b-8141178762f9',
      label: 'sprint 1',
      startDate: new Date(),
      endDate: new Date(),
    });
  }

  async loadFixtures() {
    try {
      await this._ipcService.query(appIpcs.loadFixtures);
      this.toastMessageService.showSuccess('Fixtures loaded successfully', 'Load Fixtures');
    } catch (error: any) {
      this.toastMessageService.showError(error.message, 'Load Fixtures Failed');
      throw error;
    }
  }

  async truncateDatabase() {
    try {
      await this._ipcService.query(appIpcs.truncateDatabase);
      this.toastMessageService.showSuccess('Database truncated successfully', 'Truncate Database');
    } catch (error: any) {
      this.toastMessageService.showError(error.message, 'Truncate Database failed');
      throw error;
    }
  }

  testObserver() {
    this.currentProject$.subscribe((data: { project: ProjectEntity }) => {
      this.title = data.project.label;
    });
  }

  // async loadConstitentialsFixtures() {
  //   await this.truncateDatabase();
  //   try {
  //     const sprintStatusLabels = [
  //       { label: 'SCHEDULED', backgroundColor: '#D09DFE', textColor: '#000000' },
  //       { label: 'IN PROGRESS', backgroundColor: '#FBCA04', textColor: '#000000' },
  //       { label: 'DONE', backgroundColor: '#90EE90', textColor: '#000000' },
  //     ];
  //     for (const t of sprintStatusLabels) {
  //       const type = new SprintStatusEntity();
  //       type.label = t.label;
  //       type.backgroundColor = t.backgroundColor;
  //       type.textColor = t.textColor;
  //       await this._ipcService.query(appIpcs.createSprintStatus, type);
  //     }

  //     const tasksStatusLabels = [
  //       { label: 'TO DO', backgroundColor: '#D09DFE', textColor: '#000000' },
  //       { label: 'IN PROGRESS', backgroundColor: '#FBCA04', textColor: '#000000' },
  //       { label: 'DONE', backgroundColor: '#90EE90', textColor: '#000000' },
  //     ];
  //     for (const t of tasksStatusLabels) {
  //       const type = new TaskStatusEntity();
  //       type.label = t.label;
  //       type.backgroundColor = t.backgroundColor;
  //       type.textColor = t.textColor;
  //       await this._ipcService.query(appIpcs.createTaskStatus, type);
  //     }

  //     const taskTypeLabels = [
  //       { label: 'Bug', backgroundColor: '#FF0000', textColor: '#FFFFFF' },
  //       { label: 'Feature', backgroundColor: '#CCA9DD', textColor: '#000000' },
  //       { label: 'Documentation', backgroundColor: '#ADDD8E6', textColor: '#000000' },
  //       { label: 'User Story', backgroundColor: '#072F5F', textColor: '#FFFFFF' },
  //     ];
  //     for (const t of taskTypeLabels) {
  //       const type = new TaskTypeEntity();
  //       type.label = t.label;
  //       type.backgroundColor = t.backgroundColor;
  //       type.textColor = t.textColor;
  //       await this._ipcService.query(appIpcs.createTaskType, type);
  //     }

  //     const usersTypeLabels = ['Product Owner', 'Developer', 'Scrum Master'];
  //     for (const t of usersTypeLabels) {
  //       const type = new UserTypeEntity();
  //       type.label = t;
  //       await this._ipcService.query(appIpcs.createUserType, type);
  //     }

  //     const usersLabel = [
  //       { firstname: 'Loic', lastname: 'BERTRAND', username: 'loicbertrand' },
  //       { firstname: 'Anthony', lastname: 'DUPORT', username: 'anthonyduport' },
  //       { firstname: 'Estevan', lastname: 'GAY', username: 'estevangay' },
  //       { firstname: 'Matthis', lastname: 'PINON', username: 'matthispinon' },
  //       { firstname: 'John', lastname: 'Smith', username: 'johnsmith' },
  //     ];
  //     for (const u of usersLabel) {
  //       const user = new User();
  //       user.firstname = u.firstname;
  //       user.lastname = u.lastname;
  //       user.username = u.username;
  //       user.password = 'Azertyuiop90?';
  //       await this._ipcService.query(appIpcs.createUser, user);
  //     }

  //     const project1 = new Project();
  //     project1.label = 'Agrid';
  //     project1.description =
  //       'The aim of this project is to create a website to help farmers to develop their online community';
  //     const project2 = new Project();
  //     project2.label = 'Open Days With Alexa';
  //     project2.description =
  //       'The aim of this project is to create an interactive presentation of the FISA during the open days with any alexa products';
  //     for (const p of [project1, project2]) {
  //       await this._ipcService.query(appIpcs.createProject, p);
  //     }

  //     const sprintStatuses = await this._ipcService.query<SprintStatus[]>(appIpcs.retrieveAllSprintsStatus);
  //     const taskStatuses = await this._ipcService.query<TaskStatus[]>(appIpcs.retrieveAllTasksStatus);
  //     const taskTypes = await this._ipcService.query<TaskType[]>(appIpcs.retrieveAllTasksType);
  //     const userTypes = await this._ipcService.query<UserType[]>(appIpcs.retrieveAllUsersType);
  //     const users = await this._ipcService.query<User[]>(appIpcs.retrieveAllUsers);
  //     const projects = await this._ipcService.query<Project[]>(appIpcs.retrieveAllProjects);

  //     const sprint1 = new Sprint();
  //     sprint1.label = 'First Iteration';
  //     sprint1.project = projects[0];
  //     sprint1.start_date = new Date().toString();
  //     sprint1.end_date = new Date().setDate(new Date().getDate() + 8).toString();
  //     sprint1.status = sprintStatuses[0];
  //     for (const sprint of [sprint1]) {
  //       await this._ipcService.query(appIpcs.createSprint, sprint);
  //     }
  //     this.toastMessageService.showSuccess('Fixtures loaded successfully', 'Load Fixtures');
  //   } catch (error: any) {
  //     this.toastMessageService.showError(error.message, 'Load Fixtures Failed');
  //     throw error;
  //   }
  // }
}
