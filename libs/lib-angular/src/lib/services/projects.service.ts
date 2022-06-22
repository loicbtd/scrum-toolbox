import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProjectsService {
  private _s = new Subject<boolean>();

  updateProjects() {
    this._s.next(true);
  }

  get subject$(): Observable<boolean> {
    return this._s.asObservable();
  }
}
