import { Component, inject } from '@angular/core';
import { TmdbService } from '../../services/tmdb-service';
import { Movie } from '../../interfaces/movie';
import { DatePipe } from '@angular/common';
import { SearchTool } from '../../components/search-tool/search-tool';

@Component({
  selector: 'app-movies-list',
  imports: [DatePipe, SearchTool],
  templateUrl: './movies-list.html',
  styleUrl: './movies-list.css',
})
export class MoviesList {
  private tmdbService = inject(TmdbService);
  movies: Movie[] = [];

}
