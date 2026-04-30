import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { MovieCard } from './movie-card';
import { Movie } from '../../interfaces/movie';

describe('MovieCard', () => {
  let component: MovieCard;
  let fixture: ComponentFixture<MovieCard>;

  const mockMovie: Movie = {
    id: 1,
    title: 'Matilda',
    overview: 'Matilda',
    poster_path: 'poster_path',
    release_date: '1994',
    genre_ids: [28, 12],
    original_language: 'EN',
    vote_average: 9,
    vote_count: 5000,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovieCard],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(MovieCard);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('movie', mockMovie);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should receive the movie input', () => {
    expect(component.movie()).toEqual(mockMovie);
  });
});
