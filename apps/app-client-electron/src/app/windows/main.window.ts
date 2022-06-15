import { BaseWindow } from '@libraries/lib-electron';
import { appRoutes } from '@libraries/lib-scrum-toolbox';

export class MainWindow extends BaseWindow {
  constructor() {
    super(appRoutes.scrumToolbox.root + '/' + appRoutes.scrumToolbox.usersCrud, {
      title: 'Scrum Toolbox',
      frame: true,
      resizable: true,
      minHeight: 500,
      minWidth: 960,
      iconSource: ['assets', 'images', 'icon.ico'],
    });
  }
}
