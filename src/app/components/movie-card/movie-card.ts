import { Component, inject, input } from '@angular/core';
import { Movie } from '../../interfaces/movie';
import { DatePipe, DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FavoritesService } from '../../services/favorites-service';

@Component({
  selector: 'app-movie-card',
  imports: [DatePipe, DecimalPipe, RouterLink],
  templateUrl: './movie-card.html',
  styleUrl: './movie-card.css',
})
export class MovieCard {
  movie = input.required<Movie>();

  favoritesService = inject(FavoritesService);
}
