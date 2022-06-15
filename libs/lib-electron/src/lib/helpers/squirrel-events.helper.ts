import { app } from 'electron';
import { spawn } from 'child_process';
import { resolve, join, basename } from 'path';

export default class SquirrelEventsHelper {
  private static isAppFirstRun = false;

  private static appFolder = resolve(process.execPath, '..');

  private static appRootFolder = resolve(SquirrelEventsHelper.appFolder, '..');

  private static updateExe = resolve(join(SquirrelEventsHelper.appRootFolder, 'Update.exe'));

  private static exeName: any;

  static initialize(version: string): boolean {
    if (process.argv.length === 1 || process.platform !== 'win32') {
      return false;
    }

    this.exeName = resolve(join(SquirrelEventsHelper.appRootFolder, 'app-' + version, basename(process.execPath)));

    switch (process.argv[1]) {
      case '--squirrel-install':
      case '--squirrel-updated':
        // Install desktop and start menu shortcuts
        SquirrelEventsHelper.update(['--createShortcut', SquirrelEventsHelper.exeName]);

        return true;

      case '--squirrel-uninstall':
        // Remove desktop and start menu shortcuts
        SquirrelEventsHelper.update(['--removeShortcut', SquirrelEventsHelper.exeName]);

        return true;

      case '--squirrel-obsolete':
        app.quit();
        return true;

      case '--squirrel-firstrun':
        // Check if it the first run of the software
        SquirrelEventsHelper.isAppFirstRun = true;
        return false;
    }

    return false;
  }

  static isFirstRun(): boolean {
    return SquirrelEventsHelper.isAppFirstRun;
  }

  private static update(args: Array<string>) {
    try {
      spawn(SquirrelEventsHelper.updateExe, args, { detached: true }).on('close', () => setTimeout(app.quit, 1000));
    } catch (error) {
      setTimeout(app.quit, 1000);
    }
  }
}
