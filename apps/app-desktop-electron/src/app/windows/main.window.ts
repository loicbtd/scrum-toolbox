import { appRoutes } from '@libraries/lib-common';
import { BaseWindow } from './base.window';

export class MainWindow extends BaseWindow {
  constructor() {
    super(appRoutes.backlog.root, { title: 'Scrum toolbox', frame: true, resizable: true });
  }
}
