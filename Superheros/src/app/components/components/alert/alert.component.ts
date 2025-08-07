import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { AlertMsgService } from '../../../services/alert-msg.service';
import { Alert } from '../../../models/alert';
import { switchMap, of, tap, delay, finalize, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'alert',
  imports: [],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.scss',
})
export class AlertComponent implements OnInit, OnDestroy {

  protected isDisplayed = signal<boolean>(false);
  private readonly alertService = inject(AlertMsgService);
  private readonly destroy$ = new Subject<void>();
  alert?: Alert;

  public ngOnInit(): void {
    this.alertService.alert$()
      .pipe(
        takeUntil(this.destroy$),

        switchMap((alert: Alert) =>
          of(alert).pipe(
            tap((alert) => {
              this.activateAlert(alert);
            }),
            delay(3000),
            finalize(() => {
              this.deactivateAlert();
            })
          )
        )
      )
      .subscribe();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private activateAlert(alertData: Alert): void {
    this.alert = alertData;
    this.isDisplayed.set(true);
  }

  private deactivateAlert(): void {
    this.isDisplayed.set(false);
    this.alert = undefined;
  }

}
