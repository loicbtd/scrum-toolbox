import { Application, BaseTray } from '@libraries/lib-electron';
import { MainWindow } from './windows/main.window';

export class MainTray extends BaseTray {
  constructor() {
    super(
      ['assets', 'images', 'icon.ico'],
      [
        { label: 'Display', click: () => Application.getInstance().loadWindow(MainWindow) },
        { label: 'Exit', click: () => Application.getInstance().electronApplication.exit() },
      ],
      { tooltip: 'Scrum Toolbox' }
    );
  }
}
