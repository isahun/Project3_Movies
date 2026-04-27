import { TmdbService } from './tmdb-service';
import { Injectable, signal, computed, inject } from '@angular/core';
import { Movie } from '../interfaces/movie';

@Injectable({
  providedIn: 'root',
})
export class MoviesService {
  private tmdbService = inject(TmdbService);

  movies = signal<Movie[]>([]);

  isLoading = signal(false);
  error = signal<string | null>(null);

  searchTerm = signal<string>('');
  selectedGenre = signal<number | null>(null);
  sortBy = signal<'date' | 'title' | 'director'>('date');
  sortOrder = signal<'asc' | 'desc'>('desc');

  filteredMovies = computed(() => {
    let moviesList = [...this.movies()];
    const termToSearch = this.searchTerm().toLowerCase();
    const genreToSearch = this.selectedGenre();

    if (termToSearch) {
      moviesList = moviesList.filter((movie) => movie.title.toLowerCase().includes(termToSearch));
    }

    if (genreToSearch !== null) {
      moviesList.filter((movie) => movie.genre_ids.includes(genreToSearch));
    }

    return moviesList;
  });

  loadMovies() {
    this.isLoading.set(true);
    this.error.set(null);
    this.tmdbService.getMovies().subscribe({
      next: (data) => {
        //console.log(data);
        this.movies.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set(err.message);
        this.isLoading.set(false);
      },
    });
  }
}
