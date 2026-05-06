import { computed, inject, Injectable, signal } from '@angular/core';
import { AuthService } from './auth-service';
import { Movie } from '../interfaces/movie';

@Injectable({
  providedIn: 'root',
})
export class FavoritesService {
  private authService = inject(AuthService);

  // Reutilitzem el client de Supabase creat a AuthService en lloc de crear-ne un de nou.
  // És important que tota l'app comparteixi el mateix client (sessió única).
  private supabase = this.authService.supabase;

  favorites = signal<Movie[]>([]);

  // Map<clau, valor>: estructura de dades per guardar puntuacions per ID de pel·lícula.
  // Map és millor que un objecte {} quan les claus són números i es fan moltes lectures/escriptures.
  ratings = signal<Map<number, number>>(new Map());

  // computed: Set (conjunt) de IDs de favorits, recalculat automàticament quan favorites canvia.
  // Usem Set (no Array) perquè .has() en un Set és O(1) — instantani independentment de la mida.
  // Amb un array, .includes() seria O(n) — més lent com més favorits tinguis.
  favoriteIds = computed(() => new Set(this.favorites().map((favMovie) => favMovie.id)));

  // Llista de favorits ordenada per puntuació (de major a menor), recalculada automàticament.
  // El spread [...] és necessari perquè .sort() muta l'array i Angular necessita una nova referència.
  favoritesSortedByRating = computed(() => [
    ...this.favorites().sort(
      (movieA, movieB) =>
        // ?? 0 → si la pel·lícula no té puntuació, la tractem com a 0 (va al final)
        (this.ratings().get(movieB.id) ?? 0) - (this.ratings().get(movieA.id) ?? 0),
    ),
  ]);

  async loadFavorites() {
    const user = this.authService.currentUser();
    if (!user) return; // Si no hi ha usuari, no fem res (la guard hauria d'haver-ho evitat)

    // Consulta Supabase: SELECT movie_data, movie_id, rating FROM favorites WHERE user_id = user.id
    // És el "query builder" de Supabase, que tradueix crides encadenades a SQL.
    const { data } = await this.supabase
      .from('favorites')
      .select('movie_data, movie_id, rating')
      .eq('user_id', user.id);

    // data pot ser null si hi ha error; ?? [] evita el crash
    this.favorites.set(data?.map((row: any) => row.movie_data) ?? []);

    // Construïm un Map de { movieId → rating } a partir de les files retornades
    const map = new Map<number, number>();
    data?.forEach((row: any) => {
      if (row.rating) map.set(row.movie_id, row.rating);
    });
    this.ratings.set(map);
  }

  isFavorite(movieId: number): boolean {
    // favoriteIds() és un Set → .has() és O(1)
    return this.favoriteIds().has(movieId);
  }

  async addFavorite(movie: Movie) {
    const user = this.authService.currentUser();
    if (!user) return;

    // INSERT a la taula favorites amb les dades de la pel·lícula serialitzades com a JSON (movie_data)
    await this.supabase.from('favorites').insert({
      user_id: user.id,
      movie_id: movie.id,
      movie_data: movie,
    });

    // Actualització optimista: afegim la pel·lícula al signal locals IMMEDIATAMENT,
    // sense esperar confirmació de la BD. Fa que la UI es vegi instantània.
    // signal.update() rep una funció: el paràmetre és l'array actual, retornem el nou.
    this.favorites.update((favsList) => [...favsList, movie]);
  }

  async removeFavorite(movieId: number) {
    const user = this.authService.currentUser();
    if (!user) return;

    // DELETE FROM favorites WHERE user_id = ... AND movie_id = ...
    await this.supabase.from('favorites').delete().eq('user_id', user.id).eq('movie_id', movieId);

    // Actualització optimista: filtrem la pel·lícula eliminada del signal local
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
    // Map.get() retorna undefined si la clau no existeix; ?? null ho converteix a null
    return this.ratings().get(movieId) ?? null;
  }

  async setRating(movieId: number, rating: number) {
    const user = this.authService.currentUser();
    if (!user) return;

    // UPDATE favorites SET rating = ? WHERE movie_id = ? AND user_id = ?
    await this.supabase
      .from('favorites')
      .update({ rating })
      .eq('movie_id', movieId)
      .eq('user_id', user.id);

    // Actualització optimista del Map de puntuacions.
    // new Map(map) → creem una CÒPIA del Map existent (els signals necessiten una nova referència
    // per detectar el canvi; si modifiquéssim el Map original, Angular no ho sabria).
    this.ratings.update((map) => new Map(map).set(movieId, rating));
  }
}
