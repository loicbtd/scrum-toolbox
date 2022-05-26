import { appRoutes } from '@libraries/lib-common';
import { Window } from '@libraries/lib-electron';

export class MainWindow extends Window {
  constructor() {
    super(appRoutes.scrumToolbox.root, { title: 'Scrum Toolbox', frame: true, resizable: true });
  }
}
