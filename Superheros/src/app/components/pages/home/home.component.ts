import { Component, inject, signal } from '@angular/core';
import { ListHerosComponent } from '../../sections/list-heros/list-heros.component';
import { SearchCreationComponent } from '../../sections/search-creation/search-creation.component';
import { AlertComponent } from '@components/components/alert/alert.component';
import { Alert, AlertState } from '@models/alert';
import { AlertMsgService } from '@services/alert-msg.service';
import { Subject, takeUntil, switchMap, of, tap, delay, finalize } from 'rxjs';

@Component({
  selector: 'app-home',
  imports: [SearchCreationComponent, ListHerosComponent, AlertComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  private readonly alertService = inject(AlertMsgService);
  private readonly destroy$ = new Subject<void>();

  protected readonly alertState = signal<AlertState>({ isDisplayed: false });

  public ngOnInit(): void {
    this.initializeAlert();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeAlert(): void {
    this.alertService
      .alert$()
      .pipe(
        takeUntil(this.destroy$),
        switchMap((alert: Alert) =>
          of(alert).pipe(
            tap((alert) =>
              this.alertState.update((state) => ({
                ...state,
                alert: alert,
                isDisplayed: true,
              }))
            ),
            delay(3000),
            finalize(() => {
              this.alertState.update((state) => ({
                ...state,
                isDisplayed: false,
                alert: undefined,
              }));
            })
          )
        )
      )
      .subscribe();
  }
}
