import { app } from 'electron';
import { Container } from 'inversify';
import { Connection } from 'typeorm';
import { Tray } from './tray';
import { Window } from './window';

export class Application {
  private static _instance: Application;

  public static getInstance() {
    if (!Application._instance) {
      Application._instance = new Application();
    }
    return this._instance;
  }

  windows: Window[];

  electronApplication: Electron.App;

  services: Container;

  monitoringToolDatabaseConnection: Connection;

  tray: Tray;

  rendererAppName: string;

  rendererAppPort: number;

  constructor() {
    this.electronApplication = app;

    if (!this.electronApplication.requestSingleInstanceLock()) {
      this.electronApplication.quit();
      return;
    }

    this.electronApplication.on('window-all-closed', (event: any) => event.preventDefault());
  }

  public initialize(rendererAppName: string, rendererAppPort: number): Promise<void> {
    this.rendererAppName = rendererAppName;
    this.rendererAppPort = rendererAppPort;
    return new Promise<void>((resolve) => {
      this.electronApplication.on('ready', () => resolve());
    });
  }

  public loadWindow(windowType: new () => Window, loadNewWindow = false) {
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

  public unloadAllWindows(windowType: new () => Window) {
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
