import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { signal } from '@angular/core';
import { vi } from 'vitest';

import { MoviesList } from './movies-list';
import { MoviesService } from '../../services/movies-service';

describe('MoviesList', () => {
  let component: MoviesList;
  let fixture: ComponentFixture<MoviesList>;

  const mockMoviesService = {
    filteredMovies: signal([]),
    currentPage: signal(1),
    isLoading: signal(false),
    searchTerm: signal(''),
    selectedGenre: signal(null as number | null),
    sortBy: signal<'date' | 'score'>('score'),
    sortOrder: signal<'asc' | 'desc'>('desc'),
    loadMovies: vi.fn(),
    prevPage: vi.fn(),
    nextPage: vi.fn(),
    resetFilters: vi.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MoviesList],
      providers: [
        provideRouter([]),
        { provide: MoviesService, useValue: mockMoviesService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MoviesList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
