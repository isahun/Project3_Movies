import { computed, inject, Injectable, signal } from '@angular/core';
import { AuthService } from './auth-service';
import { Movie } from '../interfaces/movie';

@Injectable({
  providedIn: 'root',
})
export class FavoritesService {
  private authService = inject(AuthService);
  private supabase = this.authService.supabase;

  favorites = signal<Movie[]>([]);
  ratings = signal<Map<number, number>>(new Map());
  favoriteIds = computed(() => new Set(this.favorites().map((favMovie) => favMovie.id)));

  favoritesSortedByRating = computed(() => [
    ...this.favorites().sort(
      (movieA, movieB) => (this.ratings().get(movieB.id) ?? 0) - (this.ratings().get(movieA.id) ?? 0),
    ),
  ]);

  async loadFavorites() {
    const user = this.authService.currentUser();

    if (!user) return;

    const { data } = await this.supabase
      .from('favorites')
      .select('movie_data, movie_id, rating')
      .eq('user_id', user.id);

    this.favorites.set(data?.map((row: any) => row.movie_data) ?? []);

    const map = new Map<number, number>();

    data?.forEach((row: any) => {
      if (row.rating) map.set(row.movie_id, row.rating);
    });

    this.ratings.set(map);
  }

  isFavorite(movieId: number): boolean {
    return this.favoriteIds().has(movieId);
  }

  async addFavorite(movie: Movie) {
    const user = this.authService.currentUser();
    if (!user) return;

    await this.supabase.from('favorites').insert({
      user_id: user.id,
      movie_id: movie.id,
      movie_data: movie,
    });

    this.favorites.update((favsList) => [...favsList, movie]);
  }

  async removeFavorite(movieId: number) {
    const user = this.authService.currentUser();
    if (!user) return;

    await this.supabase.from('favorites').delete().eq('user_id', user.id).eq('movie_id', movieId);

    this.favorites.update((favsList) => favsList.filter((movie) => movie.id !== movieId));
  }

  toggleFavorite(movie: Movie) {
    if (this.isFavorite(movie.id)) {
      this.removeFavorite(movie.id);
    } else {
      this.addFavorite(movie);
    }
  }

  getRating(movieId: number): number | null {
    return this.ratings().get(movieId) ?? null;
  }

  async setRating(movieId: number, rating: number) {
    const user = this.authService.currentUser();

    if (!user) return;

    await this.supabase
      .from('favorites')
      .update({ rating })
      .eq('movie_id', movieId)
      .eq('user_id', user.id);
    this.ratings.update((map) => new Map(map).set(movieId, rating));
  }
}
