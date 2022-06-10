import { Application } from '@libraries/lib-electron';
import { homedir } from 'os';
import { RetrieveAllUsersHandler } from './app/ipc-request-handlers/user/retrieve-all-users.handler';
import { MainTray } from './app/main.tray';
import {
  Project,
  Sprint,
  SprintStatus,
  Task,
  TaskStatus,
  TaskType,
  User,
  UserSprint,
  UserType,
  UserUserTypeProject,
} from '@libraries/lib-scrum-toolbox';
import { MainWindow } from './app/main.window';
import { CreateUserHandler } from './app/ipc-request-handlers/user/create-user.handler';
import { DeleteUserHandler } from './app/ipc-request-handlers/user/delete-user.handler';
import { UpdateUserHandler } from './app/ipc-request-handlers/user/update-user.handler';

(async () => {
  const application = Application.getInstance();

  await application.initialize('app-desktop-angular', 4200, {
    databaseConfigurations: [
      {
        id: 'main',
        entities: [
          TaskType,
          User,
          Sprint,
          Project,
          UserSprint,
          SprintStatus,
          UserType,
          UserUserTypeProject,
          Task,
          TaskStatus,
          TaskType,
        ],
      },
    ],
    ipcRequestHandlers: [CreateUserHandler, DeleteUserHandler, RetrieveAllUsersHandler, UpdateUserHandler],
    settingsDirectoryPath: [homedir(), '.scrum-toolbox'],
  });

  application.loadTray(MainTray);

  application.loadWindow(MainWindow);
})();

// TODO : restore and adapt squirrel update logic
// if (SquirrelEvents.handleEvents()) {
//   app.quit();
// }

// App.launch(app);

// CommonIpc.bootstrap();

// if (!AppHelper.isDevelopmentMode()) {
//   UpdateEvents.initAutoUpdateService();
// }
