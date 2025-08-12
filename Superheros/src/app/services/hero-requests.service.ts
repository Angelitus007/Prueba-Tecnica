import { HttpClient, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Hero } from '@models/hero';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HeroRequestsService {
  private readonly apiURL = `${environment.baseUrl}${environment.heroesEndpoint}`;
  private readonly http = inject(HttpClient);

  public loadHeroes(
    page: number,
    filter?: string
  ): Observable<HttpResponse<Hero[]>> {
    const endpoint = filter
      ? `${this.apiURL}?name_like=${filter}&_page=${page}&_limit=5`
      : `${this.apiURL}?_page=${page}&_limit=5`;

    return this.http.get<Hero[]>(endpoint, {
      observe: 'response',
      transferCache: { includeHeaders: ['X-Total-Count'] }, // To include it in the cache
    });
  }

  public createHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.apiURL, hero);
  }

  public updateHero(hero: Hero): Observable<Hero> {
    return this.http.patch<Hero>(`${this.apiURL}/${hero.id}`, hero);
  }

  public deleteHero(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiURL}/${id}`);
  }
}
