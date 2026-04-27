import { Component, input } from '@angular/core';
import { Movie } from '../../interfaces/movie';
import { DatePipe, DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-movie-card',
  imports: [DatePipe, DecimalPipe],
  templateUrl: './movie-card.html',
  styleUrl: './movie-card.css',
})
export class MovieCard {
  movie = input.required<Movie>();
}
