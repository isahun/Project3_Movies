import { Component, computed, inject, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth-service';
import { FavoritesService } from '../../services/favorites-service';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-user-profile',
  imports: [DecimalPipe],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.css',
})
export class UserProfile implements OnInit {
  authService = inject(AuthService);
  favoritesService = inject(FavoritesService);

  // computed() que llegeix el signal ratings del FavoritesService i calcula la mitjana.
  // Es recalcula automàticament cada vegada que l'usuari canvia una puntuació.
  averageRating = computed(() => {
    // ratings() és un Map<movieId, rating>. .values() retorna un iterador dels valors (les puntuacions).
    // [...iterator] converteix l'iterador a un array per poder usar .length i .reduce()
    const scoreValues = [...this.favoritesService.ratings().values()];

    // Si no hi ha puntuacions, retornem null (la plantilla mostrarà "Sense puntuacions" o similar)
    // Evitem dividir per zero: scoreValues.length seria 0 sense aquesta guarda.
    // reduce((acumulador, valor) => acumulador + valor, 0) → suma tots els valors; 0 és el valor inicial
    return scoreValues.length ? scoreValues.reduce((a, b) => a + b, 0) / scoreValues.length : null;
  });

  ngOnInit(): void {
    this.favoritesService.loadFavorites();
  }
}
