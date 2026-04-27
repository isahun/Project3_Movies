import { MoviesService } from './../../services/movies-service';
import { Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
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

  ngOnInit() {
    this.moviesService.loadMovies();
  }
}
