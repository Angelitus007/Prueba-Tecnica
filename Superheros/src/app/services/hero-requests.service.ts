import { HttpClient } from '@angular/common/http';
import { inject, Injectable, Signal, signal } from '@angular/core';
import { Hero } from '../models/hero';

@Injectable({
  providedIn: 'root'
})
export class HeroRequestsService {

  // Usando 'npx json-server db.json --static ./assets'
  private readonly apiURL = 'http://localhost:3000/superheros';
  private readonly http = inject(HttpClient);

  private _heroes = signal<Hero[]>([]);
  private _loading = signal<boolean>(false);

  private originalHeroes: Hero[] = [];

  // Tendria que hacer lo mismo con el 'loading' en los de update, create y delete? No,no?
  getAllHeroes(): void {
    this._loading.set(true);
    this.http.get<Hero[]>(this.apiURL).subscribe(heroList => {
      this.originalHeroes = heroList;
      this._heroes.set(heroList);
      this._loading.set(false);
    });
  }

  getNextHeroId(): number {
    const heroes = this._heroes();
    if (heroes.length === 0) {
      return 0;
    }
    const maxId: number = Math.max(...heroes.map(hero => hero.id));
    return maxId + 1;
  }

  restoreOriginalHeroes(): void {
    this._heroes.set(this.originalHeroes);
  }

  createHero(hero: Hero): void {
    this.http.post<Hero>(this.apiURL, hero).subscribe(newHero => {
      const updatedHeroList = [...this._heroes(), newHero];
      this._heroes.set(updatedHeroList);
    });
  }

  updateHero(hero: Hero): void {
    this.http.put<Hero>(`${this.apiURL}/${hero.id}`, hero).subscribe(updatedHero => {
      const updatedHeroes = this._heroes().map(h => h.id === updatedHero.id ? updatedHero : h);
      this._heroes.set(updatedHeroes);
    });
  }

  deleteHero(id: number) {
    console.log(`Deleting hero with ID: ${id}`);
    this.http.delete<void>(`${this.apiURL}/${id}`).subscribe(() => {
      const updatedHeroes = this._heroes().filter(h => h.id !== id)
      this._heroes.set(updatedHeroes);
    });
  }

  get heroes(): Signal<Hero[]> {
    return this._heroes;
  }

  setHeroes(heroes: Hero[]): void {
    this._heroes.set(heroes);
  }

  get loading(): Signal<boolean> {
    return this._loading;
  }

  setLoading(loading: boolean): void {
    this._loading.set(loading);
  }

}
