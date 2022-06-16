import { app } from 'electron';
import { BackgroundTasksService } from './services/background-tasks.service';
import { BaseTray } from './trays/base.tray';
import { BaseWindow } from './windows/base.window';
import { BaseBackgroundTask } from './background-tasks/base.background-task';
import { IpcMainService } from './services/ipc-main.service';
import { IpcRequestHandlerInterface } from '@libraries/lib-electron-web';
import { Container } from 'inversify';
import { dependencies } from './constants/dependencies.contant';
import { DatabaseConfiguration } from './interfaces/database-configuration.interface';
import { DatabasesService } from './services/databases.service';
import { SquirrelEventsHelper } from './helpers/squirrel-events.helper';
import { UpdateEventsHelper } from './helpers/update-events.helper';

export class Application {
  private static _instance: Application;

  public static getInstance() {
    if (!Application._instance) {
      Application._instance = new Application();
    }
    return this._instance;
  }

  private readonly _electronApplication: Electron.App;

  private _dependencies: Container;

  private _settingsDirectoryPath: string[];

  private _windows: BaseWindow[];

  private _tray: BaseTray;

  private _rendererApplicationName: string;

  private _rendererApplicationPort: number;

  constructor() {
    this._electronApplication = app;

    this._dependencies = new Container();

    if (!this._electronApplication.requestSingleInstanceLock()) {
      this._electronApplication.quit();
      return;
    }

    this._electronApplication.on('window-all-closed', (event: any) => event.preventDefault());
  }

  get electronApplication(): Electron.App {
    return this._electronApplication;
  }

  get dependencies(): Container {
    return this._dependencies;
  }

  get rendererApplicationName(): string {
    return this._rendererApplicationName;
  }

  get rendererApplicationPort(): number {
    return this._rendererApplicationPort;
  }

  get settingsDirectoryPath(): string[] {
    return this._settingsDirectoryPath;
  }

  get windows(): BaseWindow[] {
    return this._windows;
  }

  public async initialize(
    rendererApplicationName: string,
    rendererApplicationPort: number,
    version: string,
    options?: {
      backgroundTasks?: (new (...args: any[]) => BaseBackgroundTask)[];
      databaseConfigurations?: DatabaseConfiguration[];
      ipcRequestHandlers?: (new (...args: any[]) => IpcRequestHandlerInterface)[];
      settingsDirectoryPath?: string[];
      updateServerUrl?: string;
    }
  ): Promise<void> {
    this._rendererApplicationName = rendererApplicationName;
    this._rendererApplicationPort = rendererApplicationPort;

    await new Promise<void>((resolve) => {
      this._electronApplication.on('ready', () => resolve());
    });

    SquirrelEventsHelper.initialize(version);

    if (options.updateServerUrl) {
      UpdateEventsHelper.initialize(options.updateServerUrl);
    }

    if (options) {
      if (options.settingsDirectoryPath) {
        this._settingsDirectoryPath = options.settingsDirectoryPath;
      }

      if (options.backgroundTasks) {
        this._dependencies
          .bind<BackgroundTasksService>(dependencies.backgroundTasks)
          .to(BackgroundTasksService)
          .inSingletonScope();

        this._dependencies
          .get<BackgroundTasksService>(dependencies.backgroundTasks)
          .startTasks(options.backgroundTasks);
      }

      if (options.databaseConfigurations) {
        this._dependencies.bind<DatabasesService>(dependencies.databases).to(DatabasesService).inSingletonScope();

        await this._dependencies
          .get<DatabasesService>(dependencies.databases)
          .initialize(options.databaseConfigurations);
      }

      this._dependencies.bind<IpcMainService>(dependencies.ipcMain).to(IpcMainService).inSingletonScope();

      if (options.ipcRequestHandlers) {
        this._dependencies.get<IpcMainService>(dependencies.ipcMain).addRequestHandlers(options.ipcRequestHandlers);
      }
    }
  }

  public loadTray(trayType: new (...args: any[]) => BaseTray) {
    this._tray = new trayType();
  }

  public unloadTray() {
    this._tray.destroy();
    this._tray = null;
  }

  public loadWindow(windowType: new (...args: any[]) => BaseWindow, loadNewWindow = false) {
    if (!this._windows) {
      this._windows = [];
    }

    if (!loadNewWindow) {
      for (const existingWindow of this._windows) {
        if (existingWindow.constructor.name == windowType.name) {
          existingWindow.show();
          return;
        }
      }
    }

    const window = new windowType();
    window.once('ready-to-show', () => window.show());
    window.initialize();
    this._windows.push(window);
  }

  public unloadAllWindows(windowType: new (...args: any[]) => BaseWindow) {
    const matchingWindowsIndices = this._windows
      .map((existingWindow, index) => (existingWindow.constructor.name === windowType.name ? index : -1))
      .filter((index) => index !== -1)
      .sort((a, b) => b - a);

    for (const index of matchingWindowsIndices) {
      this._windows[index].destroy();
      this._windows.splice(index, 1);
    }
  }

  public unloadWindow(id: number) {
    for (let index = 0; index < Application.getInstance()._windows.length; index++) {
      if (this._windows[index].id == id) {
        this._windows[index].destroy();
        this._windows.splice(index, 1);
      }
    }
  }
}
