import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { signal } from '@angular/core';
import { of } from 'rxjs';
import { vi } from 'vitest';

import { MovieDetailPage } from './movie-detail-page';
import { TmdbService } from '../../services/tmdb-service';
import { AuthService } from '../../services/auth-service';
import { FavoritesService } from '../../services/favorites-service';

describe('MovieDetail', () => {
  let component: MovieDetailPage;
  let fixture: ComponentFixture<MovieDetailPage>;

  const mockTmdb = {
    getMovieById: vi.fn().mockReturnValue(of({ id: 1, title: 'Test Movie' })),
    getMovieCredits: vi.fn().mockReturnValue(of({ cast: [], crew: [] })),
    getMovieVideo: vi.fn().mockReturnValue(of([])),
    getMovieWatchProviders: vi.fn().mockReturnValue(of(null)),
  };

  const mockAuthService = {
    currentUser: signal(null as any),
    isLoggedIn: vi.fn().mockReturnValue(false),
  };

  const mockFavoritesService = {
    favorites: signal([]),
    ratings: signal(new Map()),
    favoriteIds: signal(new Set()),
    isFavorite: vi.fn().mockReturnValue(false),
    toggleFavorite: vi.fn(),
    getRating: vi.fn().mockReturnValue(null),
    setRating: vi.fn().mockResolvedValue(undefined),
    loadFavorites: vi.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovieDetailPage],
      providers: [
        provideRouter([]),
        { provide: TmdbService, useValue: mockTmdb },
        { provide: AuthService, useValue: mockAuthService },
        { provide: FavoritesService, useValue: mockFavoritesService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MovieDetailPage);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('movieId', '1');
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
