import { Application, BaseTray } from '@libraries/lib-electron';
import { MainWindow } from './main.window';

export class MainTray extends BaseTray {
  constructor() {
    super(
      ['assets', 'images', 'icon.ico'],
      [
        { label: 'Afficher', click: () => Application.getInstance().loadWindow(MainWindow) },
        { label: 'Quitter', click: () => Application.getInstance().electronApplication.exit() },
      ],
      { tooltip: 'Scrum Toolbox' }
    );
  }
}
