import { Application } from '@libraries/lib-electron';
import { homedir } from 'os';
import { CreateUserHandler } from './app/ipc-request-handlers/user/create-user.handler';
import { TestHandler } from './app/ipc-request-handlers/test.handler';
import { MainTray } from './app/main.tray';
import { MainWindow } from './app/main.window';
import { UpdateUserHandler } from './app/ipc-request-handlers/user/update-user.handler';
import { DeleteUserHandler } from './app/ipc-request-handlers/user/delete-user.handler';
import { RetrieveAlllUsersHandler } from './app/ipc-request-handlers/user/retreive-all-user.handler';

const HANDLERS = [TestHandler, CreateUserHandler, UpdateUserHandler, DeleteUserHandler, RetrieveAlllUsersHandler];

(async () => {
  const application = Application.getInstance();

  await application.initialize('app-desktop-angular', 4200, {
    settingsPath: [homedir(), '.scrum-toolbox'],
    enableDatabases: true,
  });

  application.loadIpcRequestHandlers(HANDLERS);

  application.loadTray(MainTray);

  application.loadWindow(MainWindow);

  application.monitoringToolDatabaseConnection = await application.databases.getConnection(process.env.DATABASE_NAME);
})();

// if (SquirrelEvents.handleEvents()) {
//   app.quit();
// }

// App.launch(app);

// CommonIpc.bootstrap();

// if (!AppHelper.isDevelopmentMode()) {
//   UpdateEvents.initAutoUpdateService();
// }
