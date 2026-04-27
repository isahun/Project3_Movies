import { Component, input, inject, OnInit, signal } from '@angular/core';
import { TmdbService } from '../../services/tmdb-service';
import { forkJoin } from 'rxjs';
import { CastMember, CrewMember } from '../../interfaces/person-detail';
import { MovieDetail } from '../../interfaces/movie-detail';
import { DatePipe, DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-movie-detail-page',
  imports: [DecimalPipe, DatePipe, RouterLink],
  templateUrl: './movie-detail-page.html',
  styleUrl: './movie-detail-page.css',
})
export class MovieDetailPage implements OnInit {
  movieId = input.required<string>();
  private tmdbService = inject(TmdbService);

  movie = signal<MovieDetail | null>(null);
  cast = signal<CastMember[]>([]);
  director = signal<CrewMember | null>(null);
  isLoading = signal(true);

  ngOnInit() {
    const movieId = Number(this.movieId());

    forkJoin({
      movie: this.tmdbService.getMovieById(movieId),
      credits: this.tmdbService.getMovieCredits(movieId),
    }).subscribe({
      next: ({ movie, credits }) => {
        this.movie.set(movie);
        this.cast.set(credits.cast.slice(0, 10));
        this.director.set(credits.crew.find((person) => person.job === 'Director') ?? null);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('error:', err);
        this.isLoading.set(false);
      }
    });
  }
}
