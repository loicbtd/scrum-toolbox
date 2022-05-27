import {
  BrowserWindow,
  dialog,
  Menu,
  MenuItem,
  MenuItemConstructorOptions,
  nativeImage,
  screen,
  shell,
} from 'electron';
import { join } from 'path';
import { Application } from './application';

export abstract class Window extends BrowserWindow {
  route: string;

  confirmClose?: boolean;

  confirmMessage?: string;

  confirmYes?: string;

  confirmNo?: string;

  menuItems: MenuItemConstructorOptions[];

  constructor(
    route: string,
    options: {
      title?: string;
      width?: number;
      height?: number;
      frame?: boolean;
      resizable?: boolean;
      confirmClose?: boolean;
      confirmMessage?: string;
      confirmYes?: string;
      confirmNo?: string;
      menuItems?: MenuItemConstructorOptions[];
      minWidth?: number;
      minHeight?: number;
      iconSource?: string[];
    }
  ) {
    super({
      width: options.width ?? Math.min(1280, screen.getPrimaryDisplay().workAreaSize.width || 1280),
      height: options.height ?? Math.min(720, screen.getPrimaryDisplay().workAreaSize.height || 720),
      minWidth: options.minWidth ?? 0,
      minHeight: options.minHeight ?? 0,
      show: false,
      frame: !!options.frame,
      resizable: options?.resizable || true,
      webPreferences: {
        contextIsolation: true,
        backgroundThrottling: false,
        preload: join(__dirname, `preload.js`),
      },
      title: options.title ?? '',
      icon: options.iconSource ? nativeImage.createFromPath(join(__dirname, ...options.iconSource)) : null,
      center: true,
    });

    this.route = route;
    this.confirmClose = options.confirmClose;
    this.confirmMessage = options.confirmMessage;
    this.confirmYes = options.confirmYes;
    this.confirmNo = options.confirmNo;
    this.menuItems = options.menuItems;
  }

  initialize() {
    let menu: Menu;

    if (this.menuItems) {
      menu = Menu.buildFromTemplate(this.menuItems);
    } else {
      menu = new Menu();
    }

    if (process.env.SOLUTION_ENVIRONMENT == 'development') {
      menu.append(
        new MenuItem({
          label: 'Development',
          submenu: [
            {
              role: 'toggleDevTools',
              accelerator: process.platform === 'darwin' ? 'Ctrl+Cmd+I' : 'Ctrl+Shift+I',
            },
            {
              role: 'reload',
              accelerator: 'Ctrl+F5',
            },
            {
              label: 'Trigger Test Function',
              click: async (_menuItem, browserWindow) => {
                await dialog.showMessageBox(browserWindow, {
                  title: 'Development',
                  message: 'Test function triggered !',
                });
              },
            },
          ],
        })
      );
    }

    this.setMenu(menu);

    this.webContents.on('will-navigate', (event, url) => {
      if (url !== this.webContents.getURL()) {
        event.preventDefault();
        shell.openExternal(url);
      }
    });

    this.webContents.on('new-window', (event, url) => {
      if (url !== this.webContents.getURL()) {
        event.preventDefault();
        shell.openExternal(url);
      }
    });

    this.on('close', async (event) => {
      event.preventDefault();
      if (this.confirmClose) {
        if (
          (
            await dialog.showMessageBox({
              title: 'Confirmation',
              message: this.confirmMessage || 'Are you sure you want to close the window ?',
              buttons: [this.confirmNo || 'No', this.confirmYes || 'Yes'],
            })
          ).response === 1
        ) {
          Application.getInstance().unloadWindow(this.id);
        }
      } else {
        Application.getInstance().unloadWindow(this.id);
      }
    });

    if (!Application.getInstance().electronApplication.isPackaged) {
      this.loadURL(`http://localhost:${Application.getInstance().rendererAppPort}#/${this.route}`);
    } else {
      this.loadURL(
        `file://${join(__dirname, '..', Application.getInstance().rendererAppName, 'index.html')}#/${this.route}`
      );
    }
  }
}
