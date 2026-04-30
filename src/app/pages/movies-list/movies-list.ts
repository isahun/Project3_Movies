import { MoviesService } from './../../services/movies-service';
import { Component, computed, inject, signal } from '@angular/core';
import { SearchTool } from '../../components/search-tool/search-tool';
import { MovieCard } from '../../components/movie-card/movie-card';

@Component({
  selector: 'app-movies-list',
  imports: [SearchTool, MovieCard],
  templateUrl: './movies-list.html',
  styleUrl: './movies-list.css',
})
export class MoviesList {
  moviesService = inject(MoviesService);
  filteredMovies = this.moviesService.filteredMovies;

  ngOnInit() {
    this.moviesService.loadMovies();
  }
}
