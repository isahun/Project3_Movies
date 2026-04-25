import { TestBed } from '@angular/core/testing';

import { TmdbService } from './tmdb-service';

describe('TmbdService', () => {
  let service: TmdbService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TmdbService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
