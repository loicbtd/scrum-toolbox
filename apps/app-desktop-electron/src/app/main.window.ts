import { appRoutes } from '@libraries/lib-common';
import { BaseWindow } from '@libraries/lib-electron';
//TODO change appRoutes.login by the vue you need to see
export class MainWindow extends BaseWindow {
  constructor() {
    super(appRoutes.login, {
      title: 'Scrum Toolbox',
      frame: true,
      resizable: true,
      minHeight: 500,
      minWidth: 960,
      iconSource: ['assets', 'images', 'icon.ico'],
    });
  }
}
