import { Component, inject, linkedSignal, OnInit, signal } from '@angular/core';
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

  private _viewMore = signal<boolean>(true);
  private _index = signal<number>(8);
  private _totalHeroes!: number;

  private _visibleHeroes = linkedSignal({
    source: () => ({allHeroes: this._heroRequestsService.heroes(),
                    currIndex: this._index}),
    computation: ({allHeroes, currIndex}) => {
      return allHeroes.slice(0, currIndex());
    }
  });

  public ngOnInit(): void {
    this.initHeroList();
  }

  protected initHeroList(): void {
    this._heroRequestsService.getAllHeroes();
    this._totalHeroes = this._heroRequestsService.heroes().length
  }

  protected loadMoreHeroes(heroesToDisplay: number): void {
    const nextIndex = this._index() + heroesToDisplay;
    this._index.set(nextIndex);

    if (nextIndex >= this._totalHeroes) {
      this._viewMore.set(false);
    }
  }

  protected showLessHeroes(heroesToDisplay: number): void {
    const nextIndex = Math.max(this._index() - heroesToDisplay, 0);
    this._index.set(nextIndex);

    if (nextIndex <= heroesToDisplay * 2) {
      this._viewMore.set(true);
    }
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
