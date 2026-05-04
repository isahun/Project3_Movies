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
  private headers = new HttpHeaders({
    Authorization: `Bearer ${environment.accessToken}`,
  });
  apiUrl = environment.apiUrl;

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = "S'ha produït un error desconegut!";
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Codi d'error del servidor: ${error.status}, missatge: ${error.message}`;
    }
    console.error(errorMessage);

    return throwError(() => new Error(errorMessage));
  }

  getMovies(page: number = 1): Observable<Movie[]> {
    return this.http
      .get<{
        results: Movie[];
      }>(`${this.apiUrl}/movie/popular?page=${page}`, { headers: this.headers })
      .pipe(
        map((response) => response.results),
        catchError(this.handleError.bind(this)),
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
      .get<{
        id: number;
        results: Video[];
      }>(`${this.apiUrl}/movie/${movieId}/videos`, { headers: this.headers })
      .pipe(
        map((response) => response.results),
        catchError(this.handleError.bind(this)),
      );
  }

  getMovieWatchProviders(
    movieId: number,
    region: string = 'ES',
  ): Observable<WatchProviderResult | null> {
    return this.http
      .get<{
        id: number;
        results: { [region: string]: WatchProviderResult };
      }>(`${this.apiUrl}/movie/${movieId}/watch/providers`, { headers: this.headers })
      .pipe(
        map((response) => response.results[region] ?? null),
        catchError(this.handleError.bind(this)),
      );
  }

  getPersonMovieCredits(personId: number): Observable<PersonMovieCredits> {
    return this.http
    .get<PersonMovieCredits>
    (`${this.apiUrl}/person/${personId}/movie_credits`, { headers: this.headers })
    .pipe(catchError(this.handleError.bind(this)));
  }
}
