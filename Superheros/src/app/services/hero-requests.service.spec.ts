import { TestBed } from '@angular/core/testing';

import { HeroRequestsService } from './hero-requests.service';

describe('HeroRequestsService', () => {
  let service: HeroRequestsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HeroRequestsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
