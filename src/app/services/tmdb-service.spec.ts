import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { HttpTestingController } from '@angular/common/http/testing';
import { TmdbService } from './tmdb-service';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { environment } from '../../environments/environment';

describe('TmbdService', () => {
  let service: TmdbService;
  let httpMock: HttpTestingController;

  const api = environment.apiUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(TmdbService);

    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // comprova que no queden requests pendents
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // --- getMovies ---

  describe('getMovies()', () => {
    it('should return the results array from the response', () => {
      const mockMovies = [{ id: 1, title: 'Avatar' }];

      service.getMovies(1).subscribe((movies) => {
        expect(movies).toEqual(mockMovies);
      });

      const req = httpMock.expectOne(`${api}/movie/popular?page=1`);

      expect(req.request.method).toBe('GET');

      req.flush({ results: mockMovies });
    });

    it('should use page 1 by default', () => {
      service.getMovies().subscribe();

      const req = httpMock.expectOne(`${api}/movie/popular?page=1`);

      req.flush({ results: [] });

      expect(req.request.urlWithParams).toContain('page=1');
    });

    it('should propagate HTTP errors', () => {
      service.getMovies().subscribe({
        error: (err) => expect(err.message).toBeTruthy(),
      });

      httpMock.expectOne(`${api}/movie/popular?page=1`).flush('Error', {
        status: 500,

        statusText: 'Server Error',
      });
    });
  });

  // --- getMovieById ---

  describe('getMovieById()', () => {
    it('should return the movie detail', () => {
      const mockDetail = { id: 42, title: 'Dune' };

      service.getMovieById(42).subscribe((detail) => {
        expect(detail).toEqual(mockDetail);
      });

      const req = httpMock.expectOne(`${api}/movie/42`);

      expect(req.request.method).toBe('GET');

      req.flush(mockDetail);
    });
  });

  // --- getMovieCredits ---

  describe('getMovieCredits()', () => {
    it('should return credits for a movie', () => {
      const mockCredits = { cast: [], crew: [] };

      service.getMovieCredits(42).subscribe((credits) => {
        expect(credits).toEqual(mockCredits);
      });

      httpMock.expectOne(`${api}/movie/42/credits`).flush(mockCredits);
    });
  });

  // --- getPersonById ---

  describe('getPersonById()', () => {
    it('should return person detail', () => {
      const mockPerson = { id: 7, name: 'Timothée Chalamet' };

      service.getPersonById(7).subscribe((person) => {
        expect(person).toEqual(mockPerson);
      });

      httpMock.expectOne(`${api}/person/7`).flush(mockPerson);
    });
  });

  // --- getMovieVideo ---

  describe('getMovieVideo()', () => {
    it('should return the results array of videos', () => {
      const mockVideos = [{ key: 'abc123', type: 'Trailer' }];

      service.getMovieVideo(42).subscribe((videos) => {
        expect(videos).toEqual(mockVideos);
      });

      httpMock.expectOne(`${api}/movie/42/videos`).flush({ id: 42, results: mockVideos });
    });
  });

  // --- getMovieWatchProviders ---

  describe('getMovieWatchProviders()', () => {
    it('should return providers for the default region (ES)', () => {
      const mockProvider = { link: 'https://...', flatrate: [] };

      service.getMovieWatchProviders(42).subscribe((providers) => {
        expect(providers).toEqual(mockProvider);
      });

      httpMock

        .expectOne(`${api}/movie/42/watch/providers`)

        .flush({ id: 42, results: { ES: mockProvider } });
    });

    it('should return null when region is not available', () => {
      service.getMovieWatchProviders(42, 'XX').subscribe((providers) => {
        expect(providers).toBeNull();
      });

      httpMock

        .expectOne(`${api}/movie/42/watch/providers`)

        .flush({ id: 42, results: {} });
    });
  });

  // --- getPersonMovieCredits ---

  describe('getPersonMovieCredits()', () => {
    it('should return movie credits for a person', () => {
      const mockCredits = { cast: [], crew: [] };

      service.getPersonMovieCredits(7).subscribe((credits) => {
        expect(credits).toEqual(mockCredits);
      });

      httpMock.expectOne(`${api}/person/7/movie_credits`).flush(mockCredits);
    });
  });
});
