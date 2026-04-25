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
      // Error de xarxa (costat client): el missatge ve de l'event.
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error HTTP (costat servidor): tenim codi d'estat i missatge.
      errorMessage = `Codi d'error del servidor: ${error.status}, missatge: ${error.message}`;
    }
    console.error(errorMessage);
    // throwError crea un Observable que emet un error immediatament.
    // El subscriptor el rep al callback `error` del subscribe().
    return throwError(() => new Error(errorMessage));
  }

  getMovies(): Observable<Movie[]> {
    return this.http
      .get<{ results: Movie[] }>(`${this.apiUrl}/movie/popular`, { headers: this.headers })
      .pipe(map((response) => response.results),
        catchError(this.handleError.bind(this))
      );
  }
}
