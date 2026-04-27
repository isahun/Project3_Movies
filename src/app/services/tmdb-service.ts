import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { Movie } from '../interfaces/movie';

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

  getMovies(page:number = 1): Observable<Movie[]> {
    return this.http
      .get<{ results: Movie[] }>(`${this.apiUrl}/movie/popular?page=${page}`, { headers: this.headers })
      .pipe(map((response) => response.results),
        catchError(this.handleError.bind(this))
      );
  }
}
