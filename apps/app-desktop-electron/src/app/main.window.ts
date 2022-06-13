import { BaseWindow } from '@libraries/lib-electron';
import { appRoutes } from '@libraries/lib-scrum-toolbox';

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
