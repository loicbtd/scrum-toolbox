import { ToadScheduler, AsyncTask, SimpleIntervalJob } from 'toad-scheduler';
import { Application } from '../application';
import { BaseBackgroundTask } from '../background-tasks/base.background-task';
import { ElectronApplicationError } from '../errors/electron-application.error';

export class BackgroundTasksService {
  private _scheduler: ToadScheduler;

  constructor() {
    this._scheduler = new ToadScheduler();
  }

  public stopAllTasks() {
    this._scheduler.stop();
  }

  public startTask(task: BaseBackgroundTask) {
    if (this._scheduler.getById(task.id)) {
      this._scheduler.removeById(task.id);
    }

    this._scheduler.addSimpleIntervalJob(
      new SimpleIntervalJob(
        task.intervalSchedule,
        new AsyncTask(
          task.id,
          async () => {
            try {
              task.handle();
            } catch (error: any) {
              throw new ElectronApplicationError(error?.message);
            }
          },
          (error: Error) => {
            Application.getInstance().logger.error(error.stack);
            task.handleError(error);
          }
        )
      )
    );
  }

  public stopTask(id: string) {
    this._scheduler.removeById(id);
  }
}
