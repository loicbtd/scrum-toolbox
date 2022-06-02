import { Application } from '@libraries/lib-electron';
import { homedir } from 'os';
import { TestHandler } from './app/ipc-request-handlers/test.handler';
import { MainTray } from './app/main.tray';
import { MainWindow } from './app/main.window';

(async () => {
  const application = Application.getInstance();

  await application.initialize('app-desktop-angular', 4200, {
    settingsPath: [homedir(), '.scrum-toolbox'],
    enableDatabases: true,
  });

  application.loadIpcRequestHandler(TestHandler);

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
