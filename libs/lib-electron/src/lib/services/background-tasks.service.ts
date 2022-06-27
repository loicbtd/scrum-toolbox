import { ToadScheduler, AsyncTask, SimpleIntervalJob } from 'toad-scheduler';
import { BaseBackgroundTask } from '../background-tasks/base.background-task';
import { ElectronApplicationError } from '../errors/electron-application.error';
import { injectable } from 'inversify';

@injectable()
export class BackgroundTasksService {
  private readonly _scheduler: ToadScheduler;

  constructor() {
    this._scheduler = new ToadScheduler();
  }

  public startTask(taskType: new (...args: any[]) => BaseBackgroundTask): void {
    const task = new taskType();

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
              await task.handle();
            } catch (error: any) {
              throw new ElectronApplicationError(error?.message);
            }
          },
          (error: Error) => {
            task.handleError(error);
          }
        )
      )
    );
  }

  public startTasks(taskTypes: (new (...args: any[]) => BaseBackgroundTask)[]) {
    for (const taskType of taskTypes) {
      this.startTask(taskType);
    }
  }

  public stopTask(id: string): void {
    this._scheduler.removeById(id);
  }

  public stopTasks(): void {
    this._scheduler.stop();
  }
}
