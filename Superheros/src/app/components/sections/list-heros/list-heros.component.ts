import { Component, effect, inject, Injector, OnInit, runInInjectionContext } from '@angular/core';
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

  private readonly heroRequestsService = inject(HeroRequestsService);
  private readonly injector = inject(Injector);

  private readonly heroes: Hero[] = [];
  private readonly isLoading: boolean = false;

  public initHeroList(): void {
    this.heroRequestsService.getAllHeroes();
  }

  ngOnInit(): void {
    this.initHeroList();

    runInInjectionContext(this.injector, () => {
      effect(() => {
        if (this.heroRequestsService.loading()) {
          console.log('Cargando héroes...');
        } else {
          console.log('Héroes cargados:', this.heroRequestsService.heroes());
          // this.heroes.push(...this.heroRequestsService.heroes());
        }
      });
    });
  }
}
