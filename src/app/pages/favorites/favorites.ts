import { Component, inject, OnInit } from '@angular/core';
import { FavoritesService } from '../../services/favorites-service';
import { MovieCard } from '../../components/movie-card/movie-card';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-favorites',
  imports: [MovieCard, RouterLink],
  templateUrl: './favorites.html',
  styleUrl: './favorites.css',
})
export class Favorites implements OnInit {
  favoritesService = inject(FavoritesService);

  ngOnInit(): void {
    this.favoritesService.loadFavorites();
  }
}
