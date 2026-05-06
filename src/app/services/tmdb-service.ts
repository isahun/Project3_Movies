import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { Movie } from '../interfaces/movie';
import { MovieDetail, WatchProviderResult } from '../interfaces/movie-detail';
import { Credits, PersonDetail } from '../interfaces/person-detail';
import { Video } from '../interfaces/movie-detail';
import { PersonMovieCredits } from '../interfaces/person-detail';

@Injectable({
  providedIn: 'root',
})
export class TmdbService {
  private http = inject(HttpClient);

  // Capçaleres HTTP que s'envien a totes les peticions.
  // L'API de TMDB requereix autenticació Bearer: és un token que va a la capçalera Authorization.
  // És diferent de passar una API key com a query param (?api_key=...), que seria menys segur.
  private headers = new HttpHeaders({
    Authorization: `Bearer ${environment.accessToken}`,
  });
  apiUrl = environment.apiUrl;

  // Mètode privat d'error centralitzat: tots els mètodes hi redirigeixen els seus errors.
  // Observable<never> significa que aquest observable MAI emetrà un valor; només llença un error.
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = "S'ha produït un error desconegut!";

    // ErrorEvent = error del costat del client (sense connexió, timeout, etc.)
    // Si no és ErrorEvent = error del servidor (404, 401, 500...)
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Codi d'error del servidor: ${error.status}, missatge: ${error.message}`;
    }
    console.error(errorMessage);

    // throwError crea un observable que immediatament llença l'error pel stream d'RxJS,
    // de manera que el .subscribe({ error: ... }) del component el pot capturar.
    return throwError(() => new Error(errorMessage));
  }

  // Observable<Movie[]>: el mètode NO retorna les dades directament, retorna un "flux" (Observable).
  // El flux només s'activa quan algú fa .subscribe() — fins llavors, no es fa cap petició HTTP.
  getMovies(page: number = 1): Observable<Movie[]> {
    return this.http
      // L'API retorna { page, results: [...], total_pages, ... }. Nosaltres només volem results.
      .get<{ results: Movie[] }>(`${this.apiUrl}/movie/popular?page=${page}`, { headers: this.headers })
      .pipe(
        // pipe() encadena operadors RxJS que transformen el valor emès
        map((response) => response.results), // extraiem l'array de dins l'objecte de resposta
        catchError(this.handleError.bind(this)), // si hi ha error, el redirigim al handler centralitzat
        // .bind(this) és necessari perquè handleError usa 'this' i es passa com a callback:
        // sense bind, 'this' dins handleError seria undefined
      );
  }

  getMovieById(movieId: number): Observable<MovieDetail> {
    return this.http
      .get<MovieDetail>(`${this.apiUrl}/movie/${movieId}`, { headers: this.headers })
      .pipe(catchError(this.handleError.bind(this)));
  }

  getMovieCredits(movieId: number): Observable<Credits> {
    return this.http
      .get<Credits>(`${this.apiUrl}/movie/${movieId}/credits`, { headers: this.headers })
      .pipe(catchError(this.handleError.bind(this)));
  }

  getPersonById(personId: number): Observable<PersonDetail> {
    return this.http
      .get<PersonDetail>(`${this.apiUrl}/person/${personId}`, { headers: this.headers })
      .pipe(catchError(this.handleError.bind(this)));
  }

  getMovieVideo(movieId: number): Observable<Video[]> {
    return this.http
      // L'API retorna { id: number, results: Video[] }; igual que getMovies, extraiem results amb map()
      .get<{ id: number; results: Video[] }>(`${this.apiUrl}/movie/${movieId}/videos`, { headers: this.headers })
      .pipe(
        map((response) => response.results),
        catchError(this.handleError.bind(this)),
      );
  }

  getMovieWatchProviders(
    movieId: number,
    region: string = 'ES', // valor per defecte: Espanya. Es podria canviar per 'US', 'FR', etc.
  ): Observable<WatchProviderResult | null> {
    return this.http
      // L'API retorna { id, results: { 'ES': {...}, 'US': {...}, ... } }
      // { [region: string]: WatchProviderResult } és una "index signature": un objecte amb claus de tipus string
      .get<{ id: number; results: { [region: string]: WatchProviderResult } }>(
        `${this.apiUrl}/movie/${movieId}/watch/providers`,
        { headers: this.headers },
      )
      .pipe(
        // Accedim a la clau dinàmica del region (p.ex. response.results['ES'])
        // Si no hi ha dades per a aquesta regió → null (operador ??)
        map((response) => response.results[region] ?? null),
        catchError(this.handleError.bind(this)),
      );
  }

  getPersonMovieCredits(personId: number): Observable<PersonMovieCredits> {
    return this.http
      .get<PersonMovieCredits>(`${this.apiUrl}/person/${personId}/movie_credits`, { headers: this.headers })
      .pipe(catchError(this.handleError.bind(this)));
  }
}
