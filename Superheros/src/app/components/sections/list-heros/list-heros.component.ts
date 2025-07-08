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

  protected readonly heroRequestsService = inject(HeroRequestsService);

  public initHeroList(): void {
    this.heroRequestsService.getAllHeroes();
  }

  ngOnInit(): void {
    this.initHeroList();
  }
}
