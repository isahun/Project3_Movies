import { TmdbService } from './tmdb-service';
import { Injectable, signal, computed, inject } from '@angular/core';
import { Movie } from '../interfaces/movie';

@Injectable({
  providedIn: 'root',
})
export class MoviesService {
  private tmdbService = inject(TmdbService);

  movies = signal<Movie[]>([]);
  currentPage = signal(1);
  isLoading = signal(false);
  error = signal<string | null>(null);

  searchTerm = signal<string>('');
  selectedGenre = signal<number | null>(null);
  sortBy = signal<'director' | 'date' | 'score'>('score');
  sortOrder = signal<'asc' | 'desc'>('desc');

  filteredMovies = computed(() => {
    let moviesList = [...this.movies()];
    const termToSearch = this.searchTerm().toLowerCase();
    const genreToSearch = this.selectedGenre();

    if (termToSearch) {
      moviesList = moviesList.filter((movie) => movie.title.toLowerCase().includes(termToSearch));
    }

    if (genreToSearch !== null) {
      moviesList = moviesList.filter((movie) => movie.genre_ids.includes(genreToSearch));
    }

    return moviesList.sort((a, b) => {
      const order = this.sortOrder() === 'desc' ? -1 : 1;

      if (this.sortBy() === 'date') {
        return (new Date(a.release_date).getTime() - new Date(b.release_date).getTime()) * order;
      }

      return (a.vote_average - b.vote_average) * order;
    });
  });

  loadMovies() {
    this.isLoading.set(true);
    this.error.set(null);
    this.tmdbService.getMovies(this.currentPage()).subscribe({
      next: (data) => {
        this.movies.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set(err.message);
        this.isLoading.set(false);
      },
    });
  }

    nextPage() {
      this.currentPage.update(p => p + 1);
      this.loadMovies();
    }

    prevPage() {
      if (this.currentPage() > 1) {
      this.currentPage.update(p => p - 1);
      this.loadMovies();
      }
    }

  resetFilters() {
    this.searchTerm.set('');
    this.sortBy.set('score');
    this.sortOrder.set('desc');
    this.selectedGenre.set(null);
  }
}
