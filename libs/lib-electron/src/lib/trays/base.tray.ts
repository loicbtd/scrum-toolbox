import { Menu, MenuItemConstructorOptions, nativeImage, Tray as ElectronTray } from 'electron';
import { join } from 'path';

export abstract class BaseTray extends ElectronTray {
  constructor(iconPath: string[], items: MenuItemConstructorOptions[] = [], options?: { tooltip?: string }) {
    super(nativeImage.createFromPath(join(__dirname, ...iconPath)));

    if (options?.tooltip) {
      this.setToolTip(options.tooltip);
    }

    this.setContextMenu(Menu.buildFromTemplate(items));
  }
}
