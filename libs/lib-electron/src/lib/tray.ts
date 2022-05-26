import { Menu, MenuItemConstructorOptions, nativeImage, Tray as ElectronTray } from 'electron';
import { join } from 'path';

export class Tray extends ElectronTray {
  constructor(items: MenuItemConstructorOptions[] = [], tooltip = '') {
    super(nativeImage.createFromPath(join(__dirname, 'assets', 'images', `icon.ico`)));
    this.setToolTip(tooltip);
    this.setContextMenu(Menu.buildFromTemplate(items));
  }
}
