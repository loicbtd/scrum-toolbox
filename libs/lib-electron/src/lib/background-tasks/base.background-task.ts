import { SimpleIntervalSchedule } from 'toad-scheduler';

export abstract class BaseBackgroundTask {
  constructor(id: string, intervalSchedule: SimpleIntervalSchedule) {
    this.id = id;
    this.intervalSchedule = intervalSchedule;
  }

  public id: string;

  public intervalSchedule: SimpleIntervalSchedule;

  public abstract handle(): Promise<void>;

  public abstract handleError(error: Error): void;
}
