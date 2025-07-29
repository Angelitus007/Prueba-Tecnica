import { Component, inject, OnInit } from '@angular/core';
import { HeroCardComponent } from "../../components/hero-card/hero-card.component";
import { HeroRequestsService } from '../../../services/hero-requests.service';
import { Hero } from '../../../models/hero';
import { NgxPaginationModule } from 'ngx-pagination';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'section-list-heros',
  imports: [HeroCardComponent, NgxPaginationModule],
  templateUrl: './list-heros.component.html',
  styleUrl: './list-heros.component.scss',
  animations: [
    trigger('heroAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-in', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('100ms ease-out', style({ opacity: 0 }))
      ])
    ])
  ],
})
export class ListHerosComponent implements OnInit {

  private readonly _heroRequestsService = inject(HeroRequestsService);
  private readonly _initialPage: number = 1;

  public ngOnInit(): void {
    this.loadPage(this._initialPage);
  }

  protected loadPage(page: number): void {
    this._heroRequestsService.loadHeroes(page);
  }

  protected onPageChange(page: number): void {
    this.loadPage(page);
  }

  public get heroes(): Hero[] {
    return this._heroRequestsService.heroes();
  }

  public get totalHeroes(): number {
    return this._heroRequestsService.totalHeroes();
  }

  public get currentPage(): number {
    return this._heroRequestsService.currentPage;
  }

  public get itemsPerPage(): number {
    return this._heroRequestsService.itemsPerPage;
  }

  public get isLoading(): boolean {
    return this._heroRequestsService.loading();
  }
}
