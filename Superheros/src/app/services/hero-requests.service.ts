import { HttpClient } from '@angular/common/http';
import { inject, Injectable, Signal, signal } from '@angular/core';
import { Hero } from '../models/hero';

@Injectable({
  providedIn: 'root'
})
export class HeroRequestsService {

  // Usando 'npx json-server db.json --static ./assets'
  // Debería guardarse la apiURL en los enviroments
  private readonly apiURL = 'http://localhost:3000/superheros';
  private readonly http = inject(HttpClient);

  private _heroes = signal<Hero[]>([]);
  private _loading = signal<boolean>(false);
  private _totalHeroes = signal<number>(0);

  private _currentFilter: string = '';
  private readonly _currentPage = signal<number>(1);
  private readonly _itemsPerPage: number = 5;

  public loadHeroes(page: number, filter?: string): void {

    this._currentPage.set(page);

    if (filter !== undefined) {
      this._currentFilter = filter;
    }

    this._loading.set(true);

    const endpoint = this._currentFilter
      ? `${this.apiURL}?name_like=${this._currentFilter}&_page=${this._currentPage()}&_limit=${this._itemsPerPage}`
      : `${this.apiURL}?_page=${this._currentPage()}&_limit=${this._itemsPerPage}`;

    this.http.get<Hero[]>(endpoint, {
      observe: 'response',
      transferCache: { includeHeaders: ['X-Total-Count'] } // Para incluirlo en la caché
    })
      .subscribe(response => {
        this._heroes.set(response.body || []);
        this._totalHeroes.set(Number(response.headers.get('X-Total-Count')));
        this._loading.set(false);
      });
  }

  public getNextHeroId(): string {
    const heroes = this._heroes();
    if (heroes.length === 0) {
      return '0';
    }
    const maxId: number = Math.max(...heroes.map(hero => Number(hero.id)));
    return (maxId + 1).toString();
  }

  public createHero(hero: Hero): void {
    this.http.post<Hero>(this.apiURL, hero).subscribe(newHero => {
      const updatedHeroList = [...this._heroes(), newHero];
      this._heroes.set(updatedHeroList);
    });
  }

  public updateHero(hero: Hero): void {
    this.http.put<Hero>(`${this.apiURL}/${hero.id}`, hero).subscribe(updatedHero => {
      const updatedHeroes = this._heroes().map(h => h.id === updatedHero.id ? updatedHero : h);
      this._heroes.set(updatedHeroes);
    });
  }

  public deleteHero(id: string): void {
    console.log(`Deleting hero with ID: ${id}`);
    this.http.delete<void>(`${this.apiURL}/${id}`).subscribe(() => {
      const updatedHeroes = this._heroes().filter(h => h.id !== id)
      this._heroes.set(updatedHeroes);
    });
  }

  public get heroes(): Signal<Hero[]> {
    return this._heroes;
  }

  public setHeroes(heroes: Hero[]): void {
    this._heroes.set(heroes);
  }

  public get totalHeroes(): Signal<number> {
    return this._totalHeroes;
  }

  public get currentPage(): number {
    return this._currentPage();
  }

  public get itemsPerPage(): number {
    return this._itemsPerPage;
  }

  public get loading(): Signal<boolean> {
    return this._loading;
  }

  public setLoading(loading: boolean): void {
    this._loading.set(loading);
  }
}
