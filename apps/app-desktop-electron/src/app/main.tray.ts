import { Application, BaseTray } from '@libraries/lib-electron';
import { MainWindow } from './main.window';

export class MainTray extends BaseTray {
  constructor() {
    super(
      ['assets', 'images', 'icon.ico'],
      [
        { label: 'test', click: async () => await Application.getInstance().ipcMainService.query('test', null) },
        { label: 'Afficher', click: () => Application.getInstance().loadWindow(MainWindow) },
        { label: 'Quitter', click: () => Application.getInstance().electronApplication.exit() },
      ],
      { tooltip: 'Scrum Toolbox' }
    );
  }
}
