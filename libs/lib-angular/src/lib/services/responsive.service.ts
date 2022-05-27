import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, fromEvent, Observable, Subject } from 'rxjs';
import { auditTime, takeUntil } from 'rxjs/operators';
import { ApplicationError } from '../errors/application.error';

@Injectable({
  providedIn: 'root',
})
export class ResponsiveService implements OnDestroy {
  private readonly _unsubscriber: Subject<void> = new Subject();

  private readonly _isMobile: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  private readonly _mediaBreakpoint: BehaviorSubject<MediaBreakpointEnumeration> =
    new BehaviorSubject<MediaBreakpointEnumeration>(MediaBreakpointEnumeration.md);

  public mobileBreakpoint = 900;

  public xsMediaBreakpoint = 0;

  public smMediaBreakpoint = 576;

  public mdMediaBreakpoint = 768;

  public lgMediaBreakpoint = 992;

  public xlMediaBreakpoint = 1200;

  public xxlMediaBreakpoint = 1600;

  public get isMobile$(): Observable<boolean> {
    return this._isMobile.asObservable();
  }

  constructor(@Inject(DOCUMENT) document: Document) {
    const window = document.defaultView;
    if (!window) {
      throw new ApplicationError();
    }

    this.setIsMobile(window.innerWidth);
    this.setMediaBreakpoint(window.innerWidth);

    fromEvent(window, 'resize')
      .pipe(takeUntil(this._unsubscriber), auditTime(100))
      .subscribe((): void => {
        this.setIsMobile(window.innerWidth);
        this.setMediaBreakpoint(window.innerWidth);
      });
  }

  ngOnDestroy(): void {
    this._unsubscriber.next();
    this._unsubscriber.complete();
  }

  private setMediaBreakpoint(width: number): void {
    if (width < this.smMediaBreakpoint) {
      this._mediaBreakpoint.next(MediaBreakpointEnumeration.xs);
    } else if (width >= this.smMediaBreakpoint && width < this.mdMediaBreakpoint) {
      this._mediaBreakpoint.next(MediaBreakpointEnumeration.sm);
    } else if (width >= this.mdMediaBreakpoint && width < this.lgMediaBreakpoint) {
      this._mediaBreakpoint.next(MediaBreakpointEnumeration.md);
    } else if (width >= this.lgMediaBreakpoint && width < this.xlMediaBreakpoint) {
      this._mediaBreakpoint.next(MediaBreakpointEnumeration.lg);
    } else if (width >= this.xlMediaBreakpoint && width < this.xxlMediaBreakpoint) {
      this._mediaBreakpoint.next(MediaBreakpointEnumeration.xl);
    } else {
      this._mediaBreakpoint.next(MediaBreakpointEnumeration.xxl);
    }
  }

  private setIsMobile(width = 0): void {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      this._isMobile.next(true);
    } else {
      this._isMobile.next(width <= this.mobileBreakpoint);
    }
  }
}

export enum MediaBreakpointEnumeration {
  xs = 'xs',
  sm = 'sm',
  md = 'md',
  lg = 'lg',
  xl = 'xl',
  xxl = 'xxl',
}
