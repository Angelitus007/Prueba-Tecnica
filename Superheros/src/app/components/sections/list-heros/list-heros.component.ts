import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { HeroCardComponent } from "../../components/hero-card/hero-card.component";
import { HeroRequestsService } from '../../../services/hero-requests.service';
import { Hero } from '../../../models/hero';

@Component({
  selector: 'section-list-heros',
  imports: [HeroCardComponent],
  templateUrl: './list-heros.component.html',
  styleUrl: './list-heros.component.scss'
})
export class ListHerosComponent implements OnInit {

  private readonly _heroRequestsService = inject(HeroRequestsService);

  private _visibleHeroes = signal<Hero[]>([]);
  private _viewMore = signal<boolean>(true);
  private index: number = 8;

  private readonly syncEffect = effect(() => {
    if (!this._heroRequestsService.loading()) {
      const allHeroes = this._heroRequestsService.heroes();
      this._visibleHeroes.set(allHeroes.slice(0, this.index));
    }
  });

  public initHeroList(): void {
    this._heroRequestsService.getAllHeroes();
  }

  ngOnInit(): void {
    this.initHeroList();

    // Sincroniza el Signal local con el Signal del servicio
    // effect(() => {
    //   if (!this._heroRequestsService.loading()) {
    //     const allHeroes = this._heroRequestsService.heroes();
    //     this._visibleHeroes.set(allHeroes.slice(0, this.index));
    //   }
    // });
  }

  loadMoreHeroes(heroesToDisplay: number): void {
    const nextIndex = this.index + heroesToDisplay;

    this._visibleHeroes.set([
      ...this._visibleHeroes(),
      ...this._heroRequestsService.heroes().slice(this.index, nextIndex)
    ]);

    this.index = nextIndex;

    if (this.index >= this._heroRequestsService.heroes().length) {
      this._viewMore.set(false);
    }
  }

  showLessHeroes(heroesToDisplay: number): void {
    this._visibleHeroes.set(this._visibleHeroes().slice(0, this.index - heroesToDisplay));
    this.index -= heroesToDisplay;

    if (this.index <= (heroesToDisplay * 2)) {
      this._viewMore.set(true);
    }
  }

  public get heroList(): Hero[] {
    return this._heroRequestsService.heroes();
  }

  public get isLoading(): boolean {
    return this._heroRequestsService.loading();
  }

  public get viewMore(): boolean {
    return this._viewMore();
  }

  public get visibleHeroes(): Hero[] {
    return this._visibleHeroes();
  }
}
