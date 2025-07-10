import { HttpClient } from '@angular/common/http';
import { inject, Injectable, Signal, signal } from '@angular/core';
import { Hero } from '../models/hero';

@Injectable({
  providedIn: 'root'
})
export class HeroRequestsService {

  // Usando 'npx json-server db.json'
  private readonly apiURL = 'http://localhost:3000/superheros';
  private readonly http = inject(HttpClient);

  private _heroes = signal<Hero[]>([]);
  private _loading = signal<boolean>(false);

  private originalHeroes: Hero[] = [];

  // Tendria que hacer lo mismo con los de update y delete con el loading?
  getAllHeroes(): void {
    this._loading.set(true);
    this.http.get<Hero[]>(this.apiURL).subscribe(heroList => {
      this.originalHeroes = heroList;
      this._heroes.set(heroList);
      this._loading.set(false);
    });
  }

  restoreOriginalHeroes(): void {
    this._heroes.set(this.originalHeroes);
  }

  getHeroByID() {

  }

  updateHero(hero: Hero): void {
    this.http.put<Hero>(`${this.apiURL}/${hero.id}`, hero).subscribe(updatedHero => {
      const updatedHeroes = this._heroes().map(h => h.id === updatedHero.id ? updatedHero : h);
      this._heroes.set(updatedHeroes);
    });
  }

  deleteHero(id: number) {
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
