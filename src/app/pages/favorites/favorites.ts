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

  // Carreguem els favorits a ngOnInit (cada vegada que s'obre la pàgina) per assegurar
  // que les dades estan actualitzades si l'usuari ha afegit favorits des d'una altra sessió.
  // authGuard garanteix que quan arribem aquí l'usuari ja està autenticat,
  // de manera que loadFavorites() trobarà sempre un currentUser vàlid.
  ngOnInit(): void {
    this.favoritesService.loadFavorites();
  }
}
