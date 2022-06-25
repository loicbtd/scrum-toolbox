import { Application } from '@libraries/lib-electron';
import { homedir } from 'os';
import { MainTray } from './app/main.tray';

import { MainWindow } from './app/windows/main.window';
import { RetrieveAllUsersHandler } from './app/ipc-request-handlers/user/retrieve-all-users.handler';
import { CreateUserHandler } from './app/ipc-request-handlers/user/create-user.handler';
import { DeleteUserHandler } from './app/ipc-request-handlers/user/delete-user.handler';
import { UpdateUserHandler } from './app/ipc-request-handlers/user/update-user.handler';
import { RetrieveUserHandler } from './app/ipc-request-handlers/user/retrieve-user.handler';
import { UpdateStatusUserHandler } from './app/ipc-request-handlers/user/update-status-user.handler';
import { LoginHandler } from './app/ipc-request-handlers/identities/login.handler';
import { CreateTaskHandler } from './app/ipc-request-handlers/task/create-task.handler';
import { RetrieveTaskHandler } from './app/ipc-request-handlers/task/retrieve-task.handler';
import { RetrieveAllTasksHandler } from './app/ipc-request-handlers/task/retrieve-all-tasks.handler';
import { UpdateTaskHandler } from './app/ipc-request-handlers/task/update-task.handler';
import { AssignSprintTaskHandler } from './app/ipc-request-handlers/task/assign-sprint-task.handler';
import { AssignUserTaskHandler } from './app/ipc-request-handlers/task/assign-user-task.handler';
import { DeleteTaskHandler } from './app/ipc-request-handlers/task/delete-task.handler';
import { CreateTaskTypeHandler } from './app/ipc-request-handlers/task-type/create-task-type.handler';
import { DeleteTaskTypeHandler } from './app/ipc-request-handlers/task-type/delete-task-type.handler';
import { RetrieveTaskTypeHandler } from './app/ipc-request-handlers/task-type/retrieve-task-type.handler';
import { RetrieveAllTaskTypesHandler } from './app/ipc-request-handlers/task-type/retrieve-all-tasks-type.handler';
import { UpdateTaskTypeHandler } from './app/ipc-request-handlers/task-type/update-task-type.handler';
import { CreateTaskStatusHandler } from './app/ipc-request-handlers/task-status/create-task-status.handler';
import { DeleteTaskStatusHandler } from './app/ipc-request-handlers/task-status/delete-task-status.handler';
import { RetrieveTaskStatusHandler } from './app/ipc-request-handlers/task-status/retrieve-task-status.handler';
import { RetrieveAllTaskStatusHandler } from './app/ipc-request-handlers/task-status/retrieve-all-tasks-status.handler';
import { UpdateTaskStatusHandler } from './app/ipc-request-handlers/task-status/update-task-status.handler';
import { GetAppVersionHandler } from './app/ipc-request-handlers/get-app-version.handler';
import { environment } from './environments/environment';
import { CreateSprintHandler } from './app/ipc-request-handlers/sprint/create-sprint.handler';
import { RetrieveSprintHandler } from './app/ipc-request-handlers/sprint/retrieve-sprint.handler';
import { RetrieveAllSprintsHandler } from './app/ipc-request-handlers/sprint/retrieve-all-sprints.handler';
import { UpdateSprintHandler } from './app/ipc-request-handlers/sprint/update-sprint.handler';
import { DeleteSprintHandler } from './app/ipc-request-handlers/sprint/delete-sprint.handler';
import { RetrieveAllSprintsByProjectHandler } from './app/ipc-request-handlers/sprint/retrieve-all-sprints-by-project.handler';
import { CreateSprintStatusHandler } from './app/ipc-request-handlers/sprint-status/create-sprint-status.handler';
import { DeleteSprintStatusHandler } from './app/ipc-request-handlers/sprint-status/delete-sprint-status.handler';
import { RetrieveSprintStatusHandler } from './app/ipc-request-handlers/sprint-status/retrieve-sprint-status.handler';
import { UpdateSprintStatusHandler } from './app/ipc-request-handlers/sprint-status/update-sprint-status.handler';
import { RetrieveAllSprintStatusHandler } from './app/ipc-request-handlers/sprint-status/retrieve-all-sprints-status.handler';
import { CreateProjectHandler } from './app/ipc-request-handlers/project/create-project.handler';
import { RetrieveProjectHandler } from './app/ipc-request-handlers/project/retrieve-project.handler';
import { RetrieveAllProjectsHandler } from './app/ipc-request-handlers/project/retrieve-all-projects.handler';
import { UpdateProjectHandler } from './app/ipc-request-handlers/project/update-project.handler';
import { DeleteProjectHandler } from './app/ipc-request-handlers/project/delete-project.handler';
import { LoadFixturesHandler } from './app/ipc-request-handlers/fixtures/load-fixtures.handler';
import { TruncateDatabaseHandler } from './app/ipc-request-handlers/truncate-database.handler';
import { mainDataSource } from './app/datasources/main.datasource';
import { RetrieveAllUsersInProject } from './app/ipc-request-handlers/project/retrieve-users-in-project.handler';
import { StartupWindow } from './app/windows/startup.window';
import { RetrieveAllTasksBySprintHandler } from './app/ipc-request-handlers/task/retrieve-all-tasks-by-sprint.handler';
import { RetrieveAllTasksByProjectHandler } from './app/ipc-request-handlers/task/retrieve-all-tasks-by-project.handler';
import { UnassignSprintTaskHandler } from './app/ipc-request-handlers/task/unassign-sprint-task.handler copy';
import { RetrieveAllSprintsOfUser } from './app/ipc-request-handlers/user/retrieve-all-sprints-of-user.handler';
import { CreateUserTypeHandler } from './app/ipc-request-handlers/user-type/create-user-type.handler';
import { DeleteUserTypeHandler } from './app/ipc-request-handlers/user-type/delete-user-type.handler';
import { RetrieveUserTypeHandler } from './app/ipc-request-handlers/user-type/retrieve-user-type.handler';
import { RetrieveAllUserTypesHandler } from './app/ipc-request-handlers/user-type/retrieve-all-user-type.handler';
import { UpdateUserTypeHandler } from './app/ipc-request-handlers/user-type/update-user-type.handler';
import { RetrieveAllUsersNotInProjectHandler } from './app/ipc-request-handlers/project/retrieve-all-users-not-in-project.handler';
import { AssignUserToProjectHandler } from './app/ipc-request-handlers/project/assign-user-to-project.handler';

(async () => {
  const application = Application.getInstance();

  await application.initialize('app-client-angular', 4200, environment.version, {
    databaseConfigurations: [
      {
        id: 'main',
        connectionOptions: mainDataSource,
      },
    ],
    ipcRequestHandlers: [
      CreateUserHandler,
      DeleteUserHandler,
      RetrieveAllUsersHandler,
      UpdateUserHandler,
      RetrieveUserHandler,
      UpdateStatusUserHandler,
      LoginHandler,
      RetrieveAllSprintsOfUser,

      AssignSprintTaskHandler,
      UnassignSprintTaskHandler,
      AssignUserTaskHandler,
      CreateTaskHandler,
      UpdateTaskHandler,
      DeleteTaskHandler,
      RetrieveAllTasksHandler,
      RetrieveTaskHandler,
      RetrieveAllTasksBySprintHandler,
      RetrieveAllTasksByProjectHandler,
      AssignUserToProjectHandler,

      CreateTaskTypeHandler,
      DeleteTaskTypeHandler,
      RetrieveTaskTypeHandler,
      RetrieveAllTaskTypesHandler,
      UpdateTaskTypeHandler,

      CreateTaskStatusHandler,
      DeleteTaskStatusHandler,
      RetrieveTaskStatusHandler,
      RetrieveAllTaskStatusHandler,
      UpdateTaskStatusHandler,

      GetAppVersionHandler,

      CreateSprintHandler,
      DeleteSprintHandler,
      RetrieveSprintHandler,
      UpdateSprintHandler,
      RetrieveAllSprintsHandler,
      RetrieveAllSprintsByProjectHandler,

      CreateSprintStatusHandler,
      DeleteSprintStatusHandler,
      RetrieveSprintStatusHandler,
      UpdateSprintStatusHandler,
      RetrieveAllSprintStatusHandler,

      CreateProjectHandler,
      DeleteProjectHandler,
      RetrieveProjectHandler,
      RetrieveAllProjectsHandler,
      UpdateProjectHandler,
      RetrieveAllUsersInProject,
      RetrieveAllUsersNotInProjectHandler,

      LoadFixturesHandler,
      TruncateDatabaseHandler,

      CreateUserTypeHandler,
      DeleteUserTypeHandler,
      RetrieveUserTypeHandler,
      RetrieveAllUserTypesHandler,
      UpdateUserTypeHandler,
    ],
    settingsDirectoryPath: [homedir(), '.scrum-toolbox'],
  });

  application.loadTray(MainTray);

  application.loadWindow(StartupWindow);

  await new Promise((resolve) => setTimeout(resolve, 3000));

  application.unloadAllWindows(StartupWindow);

  application.loadWindow(MainWindow);
})();
