import { Component, inject } from '@angular/core';
import { TmdbService } from '../../services/tmdb-service';
import { Movie } from '../../interfaces/movie';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-movies-list',
  imports: [DatePipe],
  templateUrl: './movies-list.html',
  styleUrl: './movies-list.css',
})
export class MoviesList {
  private tmdbService = inject(TmdbService);
  movies: Movie[] = [];

  ngOnInit(): void {
    this.tmdbService.getMovies().subscribe({
      next: (data) => {
        //console.log(data);
        this.movies = data
      },
      error: (err) => console.error(err)
    });

  }
}
