import { TestBed } from '@angular/core/testing';

import { FavoritesService } from './favorites-service';

import { AuthService } from './auth-service';

import { signal } from '@angular/core';

import { vi, describe, it, expect, beforeEach } from 'vitest';

describe('FavoritesService', () => {
  let service: FavoritesService;

  let mockSupabase: any;

  let mockAuthService: any;

  const mockUser = { id: 'user-1', email: 'test@test.com' };

  const mockMovie = { id: 101, title: 'Dune', poster_path: '/dune.jpg' } as any;

  beforeEach(() => {
    const queryBuilder = {
      select: vi.fn().mockReturnThis(),

      insert: vi.fn().mockResolvedValue({ error: null }),

      delete: vi.fn().mockReturnThis(),

      update: vi.fn().mockReturnThis(),

      eq: vi.fn().mockReturnThis(),
    };

    queryBuilder.select.mockResolvedValue({ data: [] });

    mockSupabase = { from: vi.fn().mockReturnValue(queryBuilder) };

    mockAuthService = { currentUser: signal(mockUser), supabase: mockSupabase };

    TestBed.configureTestingModule({
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    });

    service = TestBed.inject(FavoritesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // --- isFavorite ---

  describe('isFavorite()', () => {
    it('should return false when movie is not in favorites', () => {
      expect(service.isFavorite(101)).toBe(false);
    });

    it('should return true after adding a movie', async () => {
      await service.addFavorite(mockMovie);

      expect(service.isFavorite(101)).toBe(true);
    });
  });

  // --- addFavorite ---

  describe('addFavorite()', () => {
    it('should add movie to favorites signal', async () => {
      await service.addFavorite(mockMovie);

      expect(service.favorites()).toContain(mockMovie);
    });

    it('should do nothing if user is not logged in', async () => {
      mockAuthService.currentUser = signal(null);

      await service.addFavorite(mockMovie);

      expect(service.favorites().length).toBe(0);
    });
  });

  // --- removeFavorite ---

  describe('removeFavorite()', () => {
    it('should remove movie from favorites signal', async () => {
      await service.addFavorite(mockMovie);

      await service.removeFavorite(101);

      expect(service.isFavorite(101)).toBe(false);
    });
  });

  // --- toggleFavorite ---

  describe('toggleFavorite()', () => {
    it('should add movie if not in favorites', async () => {
      service.toggleFavorite(mockMovie);

      // Esperem la promesa asíncrona

      await Promise.resolve();

      expect(service.isFavorite(101)).toBe(true);
    });

    it('should remove movie if already in favorites', async () => {
      await service.addFavorite(mockMovie);

      service.toggleFavorite(mockMovie);

      await Promise.resolve();

      expect(service.isFavorite(101)).toBe(false);
    });
  });

  // --- getRating / setRating ---

  describe('getRating() / setRating()', () => {
    it('should return null when no rating set', () => {
      expect(service.getRating(101)).toBeNull();
    });

    it('should return the rating after setRating', async () => {
      await service.setRating(101, 4);

      expect(service.getRating(101)).toBe(4);
    });
  });

  // --- favoritesSortedByRating ---

  describe('favoritesSortedByRating', () => {
    it('should sort favorites by rating descending', async () => {
      const movie2 = { id: 202, title: 'Inception' } as any;

      await service.addFavorite(mockMovie);

      await service.addFavorite(movie2);

      await service.setRating(101, 3);

      await service.setRating(202, 5);

      const sorted = service.favoritesSortedByRating();

      expect(sorted[0].id).toBe(202); 
    });
  });
});
