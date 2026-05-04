import { Component, input, inject, OnInit, signal } from '@angular/core';
import { TmdbService } from '../../services/tmdb-service';
import { forkJoin } from 'rxjs';
import { CastMember, CrewMember } from '../../interfaces/person-detail';
import { MovieDetail, WatchProviderResult } from '../../interfaces/movie-detail';
import { DatePipe, DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { buildVideoEmbedUrl } from '../../utils/video-url.utils';
import { AuthService } from '../../services/auth-service';
import { FavoritesService } from '../../services/favorites-service';
import { Movie } from '../../interfaces/movie';
@Component({
  selector: 'app-movie-detail-page',
  imports: [DecimalPipe, DatePipe, RouterLink],
  templateUrl: './movie-detail-page.html',
  styleUrl: './movie-detail-page.css',
})
export class MovieDetailPage implements OnInit {
  private tmdbService = inject(TmdbService);
  private sanitizer = inject(DomSanitizer);
  favoritesService = inject(FavoritesService);
  authService = inject(AuthService);
  movieId = input.required<string>();

  error = signal(false);

  movie = signal<MovieDetail | null>(null);
  cast = signal<CastMember[]>([]);
  director = signal<CrewMember | null>(null);
  watchProviders = signal<WatchProviderResult | null>(null);

  trailerUrl: SafeResourceUrl | null = null;

  isLoading = signal(true);

  ngOnInit() {
    const movieId = Number(this.movieId());
    this.favoritesService.loadFavorites();

    forkJoin({
      movie: this.tmdbService.getMovieById(movieId),
      credits: this.tmdbService.getMovieCredits(movieId),
      videos: this.tmdbService.getMovieVideo(movieId),
      providers: this.tmdbService.getMovieWatchProviders(movieId),
    }).subscribe({
      next: ({ movie, credits, videos, providers }) => {
        this.movie.set(movie);
        this.cast.set(credits.cast.slice(0, 10));
        this.director.set(credits.crew.find((person) => person.job === 'Director') ?? null);
        this.watchProviders.set(providers);

        const trailer =
          videos.find(
            (video) =>
              (video.type === 'Trailer' || video.type === 'Teaser') &&
              video.site === 'YouTube' &&
              video.official,
          ) ??
          videos.find(
            (video) =>
              (video.type === 'Trailer' || video.type === 'Teaser') && video.site === 'YouTube',
          );

        if (trailer) {
          const unsanitizedUrl = buildVideoEmbedUrl(trailer.key, trailer.site);
          if (unsanitizedUrl)
            this.trailerUrl = this.sanitizer.bypassSecurityTrustResourceUrl(unsanitizedUrl);
        }

        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('error:', err);
        this.error.set(true);
        this.isLoading.set(false);
      },
    });
  }
  asMovie(): Movie | null {
    const movie = this.movie();
    if (!movie) return null;
    return {
      id: movie.id,
      title: movie.title,
      overview: movie.overview,
      poster_path: movie.poster_path,
      release_date: movie.release_date,
      vote_average: movie.vote_average,
      vote_count: 0,
      original_language: '',
      genre_ids: movie.genres.map((g) => g.id),
    };
  }
}
