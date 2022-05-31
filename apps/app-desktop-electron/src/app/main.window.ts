import { appRoutes } from '@libraries/lib-common';
import { BaseWindow } from '@libraries/lib-electron';

export class MainWindow extends BaseWindow {
  constructor() {
    super(appRoutes.scrumToolbox.root, {
      title: 'Scrum Toolbox',
      frame: true,
      resizable: true,
      minHeight: 500,
      minWidth: 960,
      iconSource: ['assets', 'images', 'icon.ico'],
    });
  }
}
