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
  private _originalHeroes: Hero[] = [];

  public getAllHeroes(): void {
    this._loading.set(true);
    this.http.get<Hero[]>(this.apiURL).subscribe(heroList => {
      this._originalHeroes = heroList;
      this._heroes.set(heroList);
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

  public restoreOriginalHeroes(): void {
    this._heroes.set(this._originalHeroes);
  }

  public get originalHeroes(): Hero[] {
    return this._originalHeroes;
  }

  public get heroes(): Signal<Hero[]> {
    return this._heroes;
  }

  public setHeroes(heroes: Hero[]): void {
    this._heroes.set(heroes);
  }

  public get loading(): Signal<boolean> {
    return this._loading;
  }

  public setLoading(loading: boolean): void {
    this._loading.set(loading);
  }
}
