import { Component, inject, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AlertComponent } from '@components/components/alert/alert.component';
import { DialogComponent } from '@components/components/dialog/dialog.component';
import { Dialogs } from '@constants/dialogs';
import { Alert, AlertState } from '@models/alert';
import { DialogConfig } from '@models/dialog-config';
import { AlertMsgService } from '@services/alert-msg.service';
import { HeroRequestsService } from '@services/hero-requests.service';
import {
  debounceTime,
  delay,
  distinctUntilChanged,
  finalize,
  of,
  Subject,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import { ListHeroesComponent } from '../../sections/list-heroes/list-heroes.component';
import { SearchCreationComponent } from '../../sections/search-creation/search-creation.component';
import { PaginationConfig } from '@models/pagination-config';
import { Hero } from '@models/hero';

@Component({
  selector: 'app-home',
  imports: [SearchCreationComponent, ListHeroesComponent, AlertComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  private readonly alertService = inject(AlertMsgService);
  private readonly destroy$ = new Subject<void>();

  protected readonly alertState = signal<AlertState>({ isDisplayed: false });

  private readonly heroRequestsService = inject(HeroRequestsService);
  private readonly filterSubject = new Subject<string>();
  protected filter: string = '';

  private readonly dialog = inject(MatDialog);

  protected createDialogConfig: DialogConfig = {
    dialogToShow: Dialogs.createHero,
  };

  protected updateDialogConfig: DialogConfig = {
    dialogToShow: Dialogs.updateHero,
  };

  protected deleteDialogConfig: DialogConfig = {
    dialogToShow: Dialogs.deleteHero,
  };

  public heroes = signal<Hero[]>([]);
  public isLoading = signal<boolean>(false);
  public totalHeroes = signal<number>(0);
  public currentPage = signal<number>(1);

  protected paginationConfig: PaginationConfig = {
    itemsPerPage: 5,
    currentPage: this.currentPage(),
    totalItems: this.totalHeroes(),
  };

  public currentFilter: string = '';

  private readonly initialPage: number = 1;

  public ngOnInit(): void {
    this.initializeAlert();
    this.setupFilter();
    this.loadPage(this.initialPage);
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

  private setupFilter(): void {
    this.filterSubject
      .pipe(debounceTime(500), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((filterValue: string) => {
        this.filter = filterValue;
        this.heroRequestsService.loadHeroes(1, filterValue || '');
      });
  }

  protected onFilterChanged(filterValue: string): void {
    this.filterSubject.next(filterValue);
  }

  protected openDialog(dialogInfo: DialogConfig) {
    this.dialog.open(DialogComponent, {
      width: dialogInfo.dialogToShow === Dialogs.deleteHero ? '44rem' : '75rem',
      position: { top: '5%' },
      data: dialogInfo,
    });
  }

  protected onPageChange(page: number): void {
    this.loadPage(page);
  }

  protected loadPage(page: number): void {
    this.isLoading.set(true);

    this.currentPage.set(page);

    if (this.filter !== undefined) {
      this.currentFilter = this.filter;
    }

    this.heroRequestsService.loadHeroes(page, this.filter).subscribe({
      next: (response) => {
        this.heroes.set(response.body || []);
        this.totalHeroes.set(Number(response.headers.get('X-Total-Count')));
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        console.error('Error loading heroes');
      },
    });
  }

  protected createHero(hero: Hero): void {
    this.heroRequestsService.createHero(hero).subscribe({
      next: (newHero) => {
        this.heroes.update((currentHeroes) => [...currentHeroes, newHero]);
      },
      error: () => {
        console.error('Error creating hero');
      },
    });
  }

  protected updateHero(hero: Hero): void {
    this.heroRequestsService.updateHero(hero).subscribe({
      next: (updatedHero) => {
        this.heroes.update((currentHeroes) =>
          currentHeroes.map((h) => (h.id === updatedHero.id ? updatedHero : h))
        );
      },
      error: () => {
        console.error('Error updating hero');
      },
    });
  }

  public getNextHeroId(): string {
    if (this.heroes().length === 0) {
      return '0';
    }
    const maxId: number = Math.max(
      ...this.heroes().map((hero) => Number(hero.id))
    );
    return (maxId + 1).toString();
  }

  protected deleteHero(id: string): void {
    this.heroRequestsService.deleteHero(id).subscribe({
      next: () => {
        this.heroes.update((currentHeroes) =>
          currentHeroes.filter((hero) => hero.id !== id)
        );
      },
      error: () => {
        console.error('Error deleting hero');
      },
    });
  }
}
