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
    ipcRequestHandlers: [RetrieveAllUsersHandler],
    settingsDirectoryPath: [homedir(), '.scrum-toolbox'],
  });

  // application.dependencies.bind<UsersService>('users').to(UsersService);
  application.dependencies.bind<RetrieveAllUsersHandler>('RetrieveAllUsersHandler').to(RetrieveAllUsersHandler);

  application.loadTray(MainTray);

  application.loadWindow(MainWindow);
})();

// if (SquirrelEvents.handleEvents()) {
//   app.quit();
// }

// App.launch(app);

// CommonIpc.bootstrap();

// if (!AppHelper.isDevelopmentMode()) {
//   UpdateEvents.initAutoUpdateService();
// }
