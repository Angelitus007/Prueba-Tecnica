import { Component, input, output } from '@angular/core';
import { HeroCardComponent } from '../../components/hero-card/hero-card.component';
import { Hero } from '@models/hero';
import { NgxPaginationModule } from 'ngx-pagination';
import { trigger, transition, style, animate } from '@angular/animations';
import { PaginationConfig } from '@models/pagination-config';

@Component({
  selector: 'section-list-heroes',
  imports: [HeroCardComponent, NgxPaginationModule],
  templateUrl: './list-heroes.component.html',
  styleUrl: './list-heroes.component.scss',
  animations: [
    trigger('heroAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-in', style({ opacity: 1 })),
      ]),
    ]),
  ],
})
export class ListHeroesComponent {
  public heroes = input.required<Hero[]>();
  public isLoading = input<boolean>();
  public deleteHero = output<string>();
  public updateHero = output<Hero>();

  public paginationConfig = input.required<PaginationConfig>();
  public pageChange = output<number>();

  protected onPageChange(page: number) {
    this.pageChange.emit(page);
  }

  protected onDeleteClick(id: string) {
    this.deleteHero.emit(id);
  }

  protected onUpdateClick(hero: Hero) {
    this.updateHero.emit(hero);
  }
}
