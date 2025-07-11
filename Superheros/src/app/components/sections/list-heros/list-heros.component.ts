import { Component, inject, OnInit, signal } from '@angular/core';
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

  private readonly heroesToDisplay: number = 8;
  private index: number = 0;

  protected visibleHeroes = signal<Hero[]>([]);
  protected viewMore = signal<boolean>(false);

  public initHeroList(): void {
    this._heroRequestsService.getAllHeroes();
  }

  ngOnInit(): void {
    this.initHeroList();
    this.loadMoreHeroes();
  }

  loadMoreHeroes(): void {
    const allHeroes = this.heroList;
    const nextIndex = this.index + this.heroesToDisplay;

    this.visibleHeroes.set([
      ...this.visibleHeroes(),
      ...allHeroes.slice(this.index, nextIndex)
    ]);

    this.index = nextIndex;
  }

  public get heroList(): Hero[] {
    return this._heroRequestsService.heroes();
  }

  public get isLoading(): boolean {
    return this._heroRequestsService.loading();
  }
}
