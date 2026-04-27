import { Component, input } from '@angular/core';

@Component({
  selector: 'app-movie-detail',
  imports: [],
  templateUrl: './movie-detail-page.html',
  styleUrl: './movie-detail.css',
})
export class MovieDetail {
  id = input.required<string>();
}
