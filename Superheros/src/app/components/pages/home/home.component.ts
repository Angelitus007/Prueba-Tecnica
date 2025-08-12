import { Component, inject, signal } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AlertComponent } from '@components/components/alert/alert.component';
import { DialogComponent } from '@components/components/dialog/dialog.component';
import { Dialogs } from '@constants/dialogs';
import { Alert, AlertState } from '@models/alert';
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
import { DialogData } from '@models/dialog-data';

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

  public heroes = signal<Hero[]>([]);
  public isLoading = signal<boolean>(false);
  public totalHeroes = signal<number>(0);
  public currentPage = signal<number>(1);

  private readonly initialPage: number = 1;
  protected paginationConfig: PaginationConfig = {
    itemsPerPage: 5,
    currentPage: this.currentPage(),
    totalItems: this.totalHeroes(),
  };

  private readonly alertMsgService = inject(AlertMsgService);

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
        this.loadPage(this.initialPage);
      });
  }

  protected onFilterChanged(filterValue: string): void {
    this.filterSubject.next(filterValue);
  }

  protected openDialog(dialogData: DialogData): void {
    const ref = this.dialog.open(DialogComponent, {
      width: dialogData.dialog === Dialogs.deleteHero ? '44rem' : '75rem',
      position: { top: '5%' },
      data: dialogData,
    });

    const outputHandlers = {
      [Dialogs.createHero]: () =>
        ref.componentInstance.createHero.subscribe((hero: Omit<Hero, 'id'>) => {
          const newHero: Hero = {
            ...hero,
            id: this.getNextHeroId(),
          };
          this.createHero(newHero);
        }),
      [Dialogs.updateHero]: () =>
        ref.componentInstance.updateHero.subscribe((hero: Hero) => {
          this.updateHero(hero) }
        ),
      [Dialogs.deleteHero]: () =>
        ref.componentInstance.deleteHero.subscribe((id: string) =>
          this.deleteHero(id)
        ),
    } as const;

    outputHandlers[dialogData.dialog]();
  }

  protected openCreateDialog(): void {
    this.openDialog({ dialog: Dialogs.createHero });
  }
  protected openUpdateDialog(hero: Hero): void {
    this.openDialog({ dialog: Dialogs.updateHero, hero });
  }
  protected openDeleteDialog(heroID: string): void {
    this.openDialog({ dialog: Dialogs.deleteHero, heroID });
  }

  protected onPageChange(page: number): void {
    this.loadPage(page);
  }

  protected loadPage(page: number): void {
    this.heroRequestsService
      .loadHeroes(page, this.filter)
      .pipe(
        tap(() => {
          this.isLoading.set(true);
          this.currentPage.set(page);
        }),
        finalize(() => {
          this.isLoading.set(false);
        })
      )
      .subscribe({
        next: (response) => {
          this.heroes.set(response.body || []);
          this.totalHeroes.set(Number(response.headers.get('X-Total-Count')));
        },
        error: () => {
          this.alertMsgService.showAlert({
            type: 'error',
            message: 'Error al cargar los héroes',
          });
        },
      });
  }

  protected createHero(hero: Hero): void {
    this.heroRequestsService.createHero(hero).subscribe({
      next: (newHero) => {
        this.heroes.update((currentHeroes) => [...currentHeroes, newHero]);
        this.alertMsgService.showAlert({
          type: 'success',
          message: 'Héroe creado con éxito',
        });
      },
      error: () => {
        this.alertMsgService.showAlert({
          type: 'error',
          message: 'Error al crear el héroe',
        });
      },
    });
  }

  protected updateHero(hero: Hero): void {
    this.heroRequestsService.updateHero(hero)
    .subscribe({
      next: (updatedHero) => {
        this.heroes.update((currentHeroes) =>
          currentHeroes.map((h) => (h.id === updatedHero.id ? updatedHero : h))
        );
        this.alertMsgService.showAlert({
          type: 'success',
          message: 'Héroe modificado con éxito',
        });
      },
      error: () => {
        this.alertMsgService.showAlert({
          type: 'error',
          message: 'Error al modificar el héroe',
        });
      },
    });
  }

  public getNextHeroId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  protected deleteHero(id: string): void {
    this.heroRequestsService.deleteHero(id)
    .subscribe({
      next: () => {
        this.heroes.update((currentHeroes) =>
          currentHeroes.filter((hero) => hero.id !== id)
        );

        this.alertMsgService.showAlert({
          type: 'success',
          message: 'Este héroe se ha eliminado',
        });
      },
      error: () => {
        this.alertMsgService.showAlert({
          type: 'error',
          message: 'Error al eliminar el héroe',
        });
      },
    });
  }

  public get paginationConfigGetter(): PaginationConfig {
  return {
    itemsPerPage: 5,
    currentPage: this.currentPage(),
    totalItems: this.totalHeroes(),
  };
}
}
