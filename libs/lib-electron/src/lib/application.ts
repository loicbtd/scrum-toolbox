import { app } from 'electron';
import { Connection } from 'typeorm';
import { BackgroundTasksService } from './services/background-tasks.service';
import { DatabasesService } from './services/databases.service';
import { BaseTray } from './trays/base.tray';
import { BaseWindow } from './windows/base.window';
import Pino from 'pino';
import { PrettyOptions } from 'pino-pretty';
import { BaseBackgroundTask } from './background-tasks/base.background-task';
import { IpcMainService } from './services/ipc-main.service';
import { IpcRequestHandlerInterface } from '@libraries/lib-electron-web';

export class Application {
  private static _instance: Application;

  public static getInstance() {
    if (!Application._instance) {
      Application._instance = new Application();
    }
    return this._instance;
  }

  windows: BaseWindow[];

  electronApplication: Electron.App;

  monitoringToolDatabaseConnection: Connection;

  tray: BaseTray;

  rendererApplicationName: string;

  rendererApplicationPort: number;

  databases: DatabasesService;

  backgroundTasksManager: BackgroundTasksService;

  ipcMainService: IpcMainService;

  logger: Pino.Logger;

  constructor() {
    this.electronApplication = app;
    this.logger = Pino({
      level: process.env.SOLUTION_ENVIRONMENT == 'development' ? 'trace' : 'info',
      transport: {
        target: 'pino-pretty',
        options: {
          ignore: 'pid,hostname',
          translateTime: 'SYS:yyyy-mm-dd HH:MM:ss',
        } as PrettyOptions,
      },
    });

    if (!this.electronApplication.requestSingleInstanceLock()) {
      this.electronApplication.quit();
      return;
    }

    this.electronApplication.on('window-all-closed', (event: any) => event.preventDefault());
  }

  public async initialize(
    rendererApplicationName: string,
    rendererApplicationPort: number,
    options?: { settingsPath?: string[]; enableDatabases?: boolean }
  ): Promise<void> {
    this.rendererApplicationName = rendererApplicationName;
    this.rendererApplicationPort = rendererApplicationPort;

    if (options?.enableDatabases) {
      this.databases = new DatabasesService(options?.settingsPath);
    }

    this.backgroundTasksManager = new BackgroundTasksService();

    this.ipcMainService = new IpcMainService();

    await new Promise<void>((resolve) => {
      this.electronApplication.on('ready', () => resolve());
    });

    this.logger.debug('Application started');
  }

  public loadIpcRequestHandler(ipcRequestHandlerType: (new () => IpcRequestHandlerInterface)) {
    // this.ipcMainService.(new eventHandlerType());
  }

  public unloadIpcRequestHandler(ipcRequestHandlerType: new () => IpcRequestHandlerInterface) {
    // this.ipcManager.unsetEventsHandler();
  }

  public loadTray(trayType: new () => BaseTray) {
    this.tray = new trayType();
  }

  public unloadTray() {
    this.tray = null;
  }

  public loadBackgroundTask(backgroundTaskType: new () => BaseBackgroundTask) {
    this.backgroundTasksManager.startTask(new backgroundTaskType());
  }

  public unloadBackgroundTask(id: string) {
    this.backgroundTasksManager.stopTask(id);
  }

  public unloadAllBackgroundTasks() {
    this.backgroundTasksManager.stopAllTasks();
  }

  public loadWindow(windowType: new () => BaseWindow, loadNewWindow = false) {
    if (!this.windows) {
      this.windows = [];
    }

    if (!loadNewWindow) {
      for (const existingWindow of this.windows) {
        if (existingWindow.constructor.name == windowType.name) {
          existingWindow.show();
          return;
        }
      }
    }

    const window = new windowType();
    window.once('ready-to-show', () => window.show());
    window.initialize();
    this.windows.push(window);
  }

  public unloadAllWindows(windowType: new () => BaseWindow) {
    const matchingWindowsIndices = this.windows
      .map((existingWindow, index) => (existingWindow.constructor.name === windowType.name ? index : -1))
      .filter((index) => index !== -1)
      .sort((a, b) => b - a);

    for (const index of matchingWindowsIndices) {
      this.windows[index].destroy();
      this.windows.splice(index, 1);
    }
  }

  public unloadWindow(id: number) {
    for (let index = 0; index < Application.getInstance().windows.length; index++) {
      if (this.windows[index].id == id) {
        this.windows[index].destroy();
        this.windows.splice(index, 1);
      }
    }
  }
}
