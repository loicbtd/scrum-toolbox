import { IpcChannels, IpcResponseModel } from '@libraries/lib-common';
import { Application, Tray } from '@libraries/lib-electron';
import { ipcMain } from 'electron';
import { MainWindow } from './app/windows/main.window';

(async () => {
  const application = Application.getInstance();
  await application.initialize('app-desktop-angular', 4200);

  ipcMain.on(IpcChannels.common.GET_APP_VERSION, (event) => {
    const ipcResponse: IpcResponseModel<string> = { data: '0.1.0' };

    event.sender.send(IpcChannels.common.GET_APP_VERSION, ipcResponse);
  });

  // this.services = ServicesConfiguration.generate();
  // this.monitoringToolDatabaseConnection = await AppDatabaseConnectionConfiguration.generate();
  // this.appBackgroundtask = await AppBackgroundtask.getInstance().initialize();

  application.tray = new Tray([
    { label: 'Afficher', click: () => application.loadWindow(MainWindow) },
    { label: 'Quitter', click: () => application.electronApplication.exit() },
  ]);

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
