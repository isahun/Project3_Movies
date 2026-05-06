import { Component, input, inject, OnInit, signal } from '@angular/core';
import { TmdbService } from '../../services/tmdb-service';
import { PersonDetail, PersonMovieCredit } from '../../interfaces/person-detail';
import { forkJoin } from 'rxjs';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-actor-detail',
  imports: [DatePipe, RouterLink],
  templateUrl: './actor-detail.html',
  styleUrl: './actor-detail.css',
})
export class ActorDetail implements OnInit {
  private tmdbService = inject(TmdbService);

  // El Router passa el paràmetre :actorId de la URL com a string (sempre).
  // Necessitem Number() per convertir-lo a número per a les crides a l'API.
  actorId = input.required<string>();

  actor = signal<PersonDetail | null>(null);
  movies = signal<PersonMovieCredit[]>([]);
  isLoading = signal(true);

  // NOTA: ngOnInit és la manera clàssica de carregar dades.
  // Alternativa moderna (Angular 19+): rxResource() que gestiona loading/error automàticament
  // i tornaria a carregar si actorId canviés sense destruir el component.
  ngOnInit(): void {
    const actorId = Number(this.actorId());

    // forkJoin llança les dues peticions EN PARAL·LEL i espera que totes dues acabin.
    // Si féssim dos .subscribe() separats, serien independents i podria haver-hi condicions de carrera.
    forkJoin({
      actor: this.tmdbService.getPersonById(actorId),
      credits: this.tmdbService.getPersonMovieCredits(actorId),
    }).subscribe({
      next: ({ actor, credits }) => {
        this.actor.set(actor);

        // credits.cast conté totes les pel·lícules on l'actor ha ACTuat (no dirigit ni produït).
        // L'encadem amb .filter().sort().slice() per netejar i limitar la llista:
        this.movies.set(
          credits.cast
            // Eliminem entrades sense pòster (sol ser produccions molt antigues o no estrenades)
            .filter((movie) => movie.poster_path)
            // Ordenem de més recent a més antic: b - a = ordre descendent per data
            .sort((a, b) => new Date(b.release_date).getTime() - new Date(a.release_date).getTime())
            // Limitem a 20 per no sobrecarregar la vista
            .slice(0, 20),
        );
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.isLoading.set(false);
      },
    });
  }
}
