import { Component, input, inject, OnInit, signal } from '@angular/core';
import { TmdbService } from '../../services/tmdb-service';
import { forkJoin } from 'rxjs';
import { PersonDetail, PersonCrewCredit } from '../../interfaces/person-detail';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-director-detail',
  imports: [RouterLink, DatePipe],
  templateUrl: './director-detail.html',
  styleUrl: './director-detail.css',
})
export class DirectorDetail implements OnInit {
  private tmdbService = inject(TmdbService);
  directorId = input.required<string>();

  director = signal<PersonDetail | null>(null);
  movies = signal<PersonCrewCredit[]>([]);
  isLoading = signal(true);

  ngOnInit(): void {
    const directorId = Number(this.directorId());

    forkJoin({
      director: this.tmdbService.getPersonById(directorId),
      credits: this.tmdbService.getPersonMovieCredits(directorId),
    }).subscribe({
      next: ({ director, credits }) => {
        this.director.set(director);
        this.movies.set(
          credits.crew
            .filter((member) => member.job === 'Director' && member.poster_path)
            .sort(
              (a, b) => new Date(b.release_date).getTime() - new Date(a.release_date).getTime(),
            ),
        );
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('error: ', err);
        this.isLoading.set(false);
      },
    });
  }
}
