import { TmdbService } from './tmdb-service';
import { Injectable, signal, computed, inject } from '@angular/core';
import { Movie } from '../interfaces/movie';

@Injectable({
  providedIn: 'root',
})
export class MoviesService {
  private tmdbService = inject(TmdbService);

  // Signals d'estat: representen les dades "en brut" que venen de l'API
  movies = signal<Movie[]>([]);
  currentPage = signal(1);
  isLoading = signal(false);
  error = signal<string | null>(null);

  // Signals de filtre/ordenació: l'usuari els modifica des de SearchTool
  searchTerm = signal<string>('');
  selectedGenre = signal<number | null>(null);
  sortBy = signal<'date' | 'score'>('score');
  sortOrder = signal<'asc' | 'desc'>('desc');

  // computed() crea un signal DERIVAT: recalcula automàticament cada vegada que canvia
  // qualsevol signal que llegeixi (movies, searchTerm, selectedGenre, sortBy, sortOrder).
  // No cal cridar-lo manualment; Angular detecta les dependències i el manté actualitzat.
  filteredMovies = computed(() => {
    // Copiem l'array amb spread [...] perquè .sort() muta l'array original,
    // i no volem alterar el signal movies directament.
    let moviesList = [...this.movies()];
    const termToSearch = this.searchTerm().toLowerCase();
    const genreToSearch = this.selectedGenre();

    if (termToSearch) {
      // .toLowerCase() als dos costats → cerca insensible a majúscules/minúscules
      moviesList = moviesList.filter((movie) => movie.title.toLowerCase().includes(termToSearch));
    }

    if (genreToSearch !== null) {
      // Comprovem null explícitament (no falsiness) perquè genreId 0 seria falsy però vàlid
      moviesList = moviesList.filter((movie) => movie.genre_ids.includes(genreToSearch));
    }

    return moviesList.sort((a, b) => {
      // Truc del multiplicador: 'desc' → -1 inverteix el resultat de la comparació,
      // 'asc' → 1 el deixa igual. Evita escriure dos sort() separats.
      const order = this.sortOrder() === 'desc' ? -1 : 1;

      if (this.sortBy() === 'date') {
        // .getTime() converteix una Date a número (mil·lisegons des de l'1/1/1970)
        // per poder restar dates directament
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
    // signal.update() rep una funció: agafa el valor actual i retorna el nou.
    // És equivalent a: this.currentPage.set(this.currentPage() + 1)
    this.currentPage.update(p => p + 1);
    this.loadMovies();
  }

  prevPage() {
    // Guard per evitar pàgina 0 o negativa
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
