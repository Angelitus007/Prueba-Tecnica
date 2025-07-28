import { TestBed } from '@angular/core/testing';

import { MetaService } from './meta.service';

describe('MetaService', () => {
  let service: MetaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MetaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('Debería actualizar las meta etiquetas correctamente si incluyen OG', () => {

    const description = 'Test description';
    const robots = 'index, follow';
    const metatags = {
      'og:title': 'Open Graph Title',
      'og:description': 'Open Graph Description',
      'og:image': 'http://example.com/image.jpg',
      'og:url': 'http://example.com'
    }

    service.setMetaTags(description, robots, metatags['og:title'], metatags['og:description'], metatags['og:image'], metatags['og:url']);

    expect(service.getMetaTags().getTag('name="description"')?.content).toBe(description);
    expect(service.getMetaTags().getTag('name="robots"')?.content).toBe(robots);
    expect(service.getMetaTags().getTag('property="og:title"')?.content).toBe(metatags['og:title']);
    expect(service.getMetaTags().getTag('property="og:description"')?.content).toBe(metatags['og:description']);
    expect(service.getMetaTags().getTag('property="og:image"')?.content).toBe(metatags['og:image']);
    expect(service.getMetaTags().getTag('property="og:url"')?.content).toBe(metatags['og:url']);

  });

  it('Debería actualizar las meta etiquetas correctamente si no incluyen OG', () => {
    const description = 'Test description';
    const robots = 'index, follow';
    service.setMetaTags(description, robots);

    expect(service.getMetaTags().getTag('name="description"')?.content).toBe(description);
    expect(service.getMetaTags().getTag('name="robots"')?.content).toBe(robots);
  });

});
