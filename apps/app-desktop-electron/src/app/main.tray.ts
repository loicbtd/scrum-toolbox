import { Application, BaseTray, DatabasesService, dependencies } from '@libraries/lib-electron';
import { TaskType, User } from '@libraries/lib-scrum-toolbox';
import { MainWindow } from './main.window';

export class MainTray extends BaseTray {
  constructor() {
    super(
      ['assets', 'images', 'icon.ico'],
      [
        { label: 'Afficher', click: () => Application.getInstance().loadWindow(MainWindow) },
        { label: 'Quitter', click: () => Application.getInstance().electronApplication.exit() },
        {
          label: 'test',
          click: async () => {
            const service = Application.getInstance().dependencies.get<DatabasesService>(dependencies.databases);

            const a = await service.getDataSource('main').getRepository<TaskType>(TaskType).count();

            console.log(a);
          },
        },
      ],
      { tooltip: 'Scrum Toolbox' }
    );
  }
}
