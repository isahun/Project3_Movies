import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { signal } from '@angular/core';
import { vi } from 'vitest';

import { Favorites } from './favorites';
import { AuthService } from '../../services/auth-service';
import { FavoritesService } from '../../services/favorites-service';

describe('Favorites', () => {
  let component: Favorites;
  let fixture: ComponentFixture<Favorites>;

  const mockAuthService = {
    currentUser: signal(null as any),
    supabase: { auth: { getSession: vi.fn() } },
  };

  const mockFavoritesService = {
    favorites: signal([]),
    favoritesSortedByRating: signal([]),
    loadFavorites: vi.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Favorites],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: mockAuthService },
        { provide: FavoritesService, useValue: mockFavoritesService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Favorites);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
