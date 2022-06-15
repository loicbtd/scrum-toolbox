import { BaseWindow } from '@libraries/lib-electron';
import { appRoutes } from '@libraries/lib-scrum-toolbox';

export class StartupWindow extends BaseWindow {
  constructor() {
    super(appRoutes.startup.root, { title: 'Startup', width: 350, height: 200, frame: false, resizable: false });
  }
}
