import { TestBed } from '@angular/core/testing';

import { HeroRequestsService } from './hero-requests.service';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Hero } from '../models/hero';

describe('HeroRequestsService', () => {
  let service: HeroRequestsService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(withFetch()),
      provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(HeroRequestsService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Verificamos que no haya peticiones pendientes
    httpTesting.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('Debería cargar los héroes para una página y actualizar el Signal', () => {
    // GIVEN
    let page: number = 1;
    const mockHeroes: Hero[] = [
      { id: '1', name: 'Superman', superpower: 'Flight', description: 'Man of Steel', imageURL: 'superman.jpg', city: 'Metropolis' },
      { id: '2', name: 'Batman', superpower: 'Intelligence', description: 'Dark Knight', imageURL: 'batman.jpg', city: 'Gotham' },
      { id: '3', name: 'Wonder Woman', superpower: 'Strength', description: 'Amazon Princess', imageURL: 'wonderwoman.jpg', city: 'Themyscira' },
      { id: '4', name: 'Aquaman', superpower: 'Water Control', description: 'King of Atlantis', imageURL: 'aquaman.jpg', city: 'Atlantis' },
      { id: '5', name: 'Green Lantern', superpower: 'Power Ring', description: 'Protector of the Universe', imageURL: 'greenlantern.jpg', city: 'Coast City' }
    ];

    // WHEN
    service.loadHeroes(page);

    const req = httpTesting.expectOne('http://localhost:3000/superheros?_page=1&_limit=5');
    expect(req.request.method).toBe('GET');
    req.flush(mockHeroes); // Simulamos la respuesta exitosa del backend/del servidor con el mock

    // THEN
    expect(service.heroes()).toEqual(mockHeroes);
    expect(service.loading()).toBe(false);
  });

  it('Debería poder buscar héroes por similitud en el nombre y actualizar el Signal', () => {
    // GIVEN
    let page: number = 1;
    let filter: string = 'man';
    const mockHeroes: Hero[] = [
      { id: '1', name: 'Superman', superpower: 'Flight', description: 'Man of Steel', imageURL: 'superman.jpg', city: 'Metropolis' },
      { id: '2', name: 'Batman', superpower: 'Intelligence', description: 'Dark Knight', imageURL: 'batman.jpg', city: 'Gotham' },
      { id: '3', name: 'Wonder Woman', superpower: 'Strength', description: 'Amazon Princess', imageURL: 'wonderwoman.jpg', city: 'Themyscira' }
    ];

    // WHEN
    service.loadHeroes(page, filter);

    const req = httpTesting.expectOne('http://localhost:3000/superheros?name_like=man&_page=1&_limit=5');
    expect(req.request.method).toBe('GET');
    req.flush(mockHeroes); // Simulamos la respuesta exitosa del backend/del servidor con el mock

    // THEN
    expect(service.heroes()).toEqual(mockHeroes);
    expect(service.loading()).toBe(false);

  });

  it('Debería obtener el ID del siguiente héroe correctamente', () => {
    // GIVEN
    const mockHeroes: Hero[] = [
      { id: '1', name: 'Superman', superpower: 'Flight', description: 'Man of Steel', imageURL: 'superman.jpg', city: 'Metropolis' },
      { id: '2', name: 'Batman', superpower: 'Intelligence', description: 'Dark Knight', imageURL: 'batman.jpg', city: 'Gotham' }
    ];
    const expectedNextId = '3';

    // Preparamos el servicio con los héroes mockeados
    service.setHeroes(mockHeroes);

    // WHEN
    const nextHeroId = service.getNextHeroId();

    // THEN
    expect(nextHeroId).toBe(expectedNextId);
  });

  it('Debería crear un nuevo héroe y colocarlo en última posición correctamente', () => {
    // GIVEN
    const mockHeroes: Hero[] = [
      { id: '1', name: 'Superman', superpower: 'Flight', description: 'Man of Steel', imageURL: 'superman.jpg', city: 'Metropolis' },
      { id: '2', name: 'Batman', superpower: 'Intelligence', description: 'Dark Knight', imageURL: 'batman.jpg', city: 'Gotham' }
    ];
    const newHero: Hero = { id: '3', name: 'Flash', superpower: 'Speed', description: 'Scarlet Speedster', imageURL: 'flash.jpg', city: 'Central City' };

    // Preparamos el servicio con los héroes mockeados
    service.setHeroes(mockHeroes);

    // WHEN
    service.createHero(newHero);

    const req = httpTesting.expectOne('http://localhost:3000/superheros');
    expect(req.request.method).toBe('POST');
    req.flush(newHero); // Simulamos la respuesta exitosa del backend con el nuevo héroe

    // THEN
    const updatedHeroList = service.heroes();
    expect(updatedHeroList[updatedHeroList.length - 1]).toEqual(newHero);
  });

  it('Debería actualizar un héroe correctamente', () => {
    // GIVEN
    const mockHeroes: Hero[] = [
      { id: '1', name: 'Superman', superpower: 'Flight', description: 'Man of Steel', imageURL: 'superman.jpg', city: 'Metropolis' },
      { id: '2', name: 'Batman', superpower: 'Intelligence', description: 'Dark Knight', imageURL: 'batman.jpg', city: 'Gotham' }
    ];
    const modifiedHero: Hero = { id: '2', name: 'Batmancito', superpower: 'Genius', description: 'Dark Knight with Genius IQ', imageURL: 'batman.jpg', city: 'Gotham' };

    // Preparamos el servicio con los héroes mockeados
    service.setHeroes(mockHeroes);

    // WHEN
    service.updateHero(modifiedHero);

    const req = httpTesting.expectOne(`http://localhost:3000/superheros/${modifiedHero.id}`);
    expect(req.request.method).toBe('PUT');
    req.flush(modifiedHero); // Simulamos la respuesta exitosa del backend con el héroe actualizado

    // THEN
    const updatedHeroList = service.heroes();
    expect(updatedHeroList.find(hero => hero.id === modifiedHero.id)).toEqual(modifiedHero);
  });

  it('Debería eliminar un héroe correctamente', () => {
    // GIVEN
    const mockHeroes: Hero[] = [
      { id: '1', name: 'Superman', superpower: 'Flight', description: 'Man of Steel', imageURL: 'superman.jpg', city: 'Metropolis' },
      { id: '2', name: 'Batman', superpower: 'Intelligence', description: 'Dark Knight', imageURL: 'batman.jpg', city: 'Gotham' }
    ];
    const idHeroToDelete = '1';

    // Preparamos el servicio con los héroes mockeados
    service.setHeroes(mockHeroes);

    // WHEN
    service.deleteHero(idHeroToDelete);

    const req = httpTesting.expectOne(`http://localhost:3000/superheros/${idHeroToDelete}`);
    expect(req.request.method).toBe('DELETE');
    req.flush({}); // Simulamos la respuesta exitosa del backend

    // THEN
    const updatedHeroList = service.heroes();
    expect(updatedHeroList.find(hero => hero.id === idHeroToDelete)).toBeUndefined();
  });

});
