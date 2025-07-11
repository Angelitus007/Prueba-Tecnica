import { Component, inject, OnInit } from '@angular/core';
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

  public initHeroList(): void {
    this._heroRequestsService.getAllHeroes();
  }

  ngOnInit(): void {
    this.initHeroList();
  }

  loadMoreHeroes(): void {

  }

  public get heroList(): Hero[] {
    return this._heroRequestsService.heroes();
  }

  public get isLoading(): boolean {
    return this._heroRequestsService.loading();
  }
}
