import { Component, computed, inject, linkedSignal, OnInit, signal } from '@angular/core';
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
  private _totalHeroes = computed(() => this._heroRequestsService.heroes().length);

  private _visibleHeroes = linkedSignal({
    source: () => ({allHeroes: this._heroRequestsService.heroes(),
                    currIndex: this._index}),
    computation: ({allHeroes, currIndex}) => {
      return allHeroes.slice(0, currIndex());
    }
  });

  public ngOnInit(): void {
    this.initHeroList();

    console.log('Total heroes:', this._totalHeroes());
    console.log('Current index:', this._index());
    console.log('View more:', this._viewMore());
  }

  protected initHeroList(): void {
    this._heroRequestsService.getAllHeroes();
  }

  protected toggleHeroes(heroesToDisplay: number): void {
    const totalHeroes = this._totalHeroes();
    const currentIndex = this._index();

    if (this._viewMore()) {
      const nextIndex = Math.min(currentIndex + heroesToDisplay, totalHeroes);
      this._index.set(nextIndex);

      if (nextIndex >= totalHeroes) {
        this._viewMore.set(false);
      }
    } else {
      const nextIndex = Math.max(currentIndex - heroesToDisplay, 8);
      this._index.set(nextIndex);

      if (nextIndex <= 8) {
        this._viewMore.set(true);
      }
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

  public get totalHeroes(): number {
    return this._totalHeroes();
  }
}
