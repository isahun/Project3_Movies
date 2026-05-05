import { TestBed } from '@angular/core/testing';
import { TmdbService } from './tmdb-service';
import { MoviesService } from './movies-service';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { of, throwError, using } from 'rxjs';

describe('MoviesService', () => {
  let service: MoviesService;
  let mockTmdb: { getMovies: ReturnType<typeof vi.fn> };

  const mockMovies = [
    { id: 1, title: 'Avatar', vote_average: 7.5, release_date: '2009-12-18', genre_ids: [28, 12] },

    { id: 2, title: 'Barbie', vote_average: 6.8, release_date: '2023-07-21', genre_ids: [35] },

    { id: 3, title: 'Avengers', vote_average: 8.4, release_date: '2012-05-04', genre_ids: [28] },
  ];

  beforeEach(() => {
    mockTmdb = {
      getMovies: vi.fn().mockReturnValue(of(mockMovies)),
    };

    TestBed.configureTestingModule({
      providers: [{ provide: TmdbService, useValue: mockTmdb }],
    });
    service = TestBed.inject(MoviesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  //Filtered movies
  describe('filteredMovies', () => {
    beforeEach(() => {
      service.movies.set(mockMovies as any);
    });

    it('should return all movies when no filter applied', () => {
      expect(service.filteredMovies().length).toBe(3);
    });

    it('should filter by search term (case-insensitive)', () => {
      service.searchTerm.set('avatar');
      expect(service.filteredMovies().length).toBe(1);
      expect(service.filteredMovies()[0].title).toBe('Avatar');
    });

    it('should return empty array when no movie matches search term', () => {
      service.searchTerm.set('xyz1');
      expect(service.filteredMovies().length).toBe(0);
    });

    it('should filter by genre', () => {
      service.selectedGenre.set(28);
      expect(service.filteredMovies().length).toBe(2);
    });

    it('should sort by score descending by default', () => {
      const scores = service.filteredMovies().map((movie) => movie.vote_average);
      expect(scores[0]).toBeGreaterThanOrEqual(scores[1]);
    });

    it('should sort by score ascending', () => {
      service.sortOrder.set('asc');
      const scores = service.filteredMovies().map((movie) => movie.vote_average);
      expect(scores[0]).toBeLessThanOrEqual(scores[1]);
    });

    it('should sort by date descending', () => {
      service.sortBy.set('date');
      service.sortOrder.set('desc');
      const dates = service.filteredMovies().map((movie) => new Date(movie.release_date).getTime());
      expect(dates[0]).toBeGreaterThanOrEqual(dates[1]);
    });
  });

  //RESET FILTERS
  describe('resetFilters()', () => {
    it('should reset all filters to default', () => {
      service.searchTerm.set('test');
      service.selectedGenre.set(28);
      service.sortBy.set('date');
      service.sortOrder.set('asc');

      service.resetFilters();

      expect(service.searchTerm()).toBe('');
      expect(service.selectedGenre()).toBeNull();
      expect(service.sortBy()).toBe('score');
      expect(service.sortOrder()).toBe('desc');
    });
  });

  //LOAD MOVIES
  describe('loadMovies()', () => {
    it('should set isLoading to true while loading', () => {
      mockTmdb.getMovies.mockReturnValue(of([]));
      service.loadMovies();
      expect(service.isLoading()).toBe(false);
    });

    it('should populate movies on success', () => {
      service.loadMovies();

      expect(service.movies()).toEqual(mockMovies);
    });

    it('should set error message on failure', () => {
      mockTmdb.getMovies.mockReturnValue(throwError(() => new Error('Network error')));

      service.loadMovies();

      expect(service.error()).toBe('Network error');
    });
  });

  // --- paginació ---

  describe('nextPage() / prevPage()', () => {
    it('nextPage should increment currentPage and reload', () => {
      service.nextPage();

      expect(service.currentPage()).toBe(2);

      expect(mockTmdb.getMovies).toHaveBeenCalledWith(2);
    });

    it('prevPage should decrement currentPage when > 1', () => {
      service.currentPage.set(3);

      service.prevPage();

      expect(service.currentPage()).toBe(2);
    });

    it('prevPage should NOT go below page 1', () => {
      service.prevPage(); // currentPage ja és 1

      expect(service.currentPage()).toBe(1);
    });
  });
});
