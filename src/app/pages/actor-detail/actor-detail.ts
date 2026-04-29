import { Component, input, inject, OnInit, signal } from '@angular/core';
import { TmdbService } from '../../services/tmdb-service';
import { PersonDetail, PersonMovieCredit } from '../../interfaces/person-detail';
import { forkJoin } from 'rxjs';
import { DatePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-actor-detail',
  imports: [DatePipe, RouterLink],
  templateUrl: './actor-detail.html',
  styleUrl: './actor-detail.css',
})
export class ActorDetail implements OnInit {
  private tmdbService = inject(TmdbService);
  actorId = input.required<string>();

  actor = signal<PersonDetail | null>(null);
  movies = signal<PersonMovieCredit[]>([]);
  isLoading = signal(true);

  ngOnInit(): void {
    const actorId = Number(this.actorId());

    forkJoin({
      actor: this.tmdbService.getPersonById(actorId),
      credits: this.tmdbService.getPersonMovieCredits(actorId),
    }).subscribe({
      next: ({ actor, credits }) => {
        this.actor.set(actor);
        this.movies.set(
          credits.cast
            .filter((movie) => movie.poster_path)
            .sort((a, b) => new Date(b.release_date).getTime() - new Date(a.release_date).getTime())
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
