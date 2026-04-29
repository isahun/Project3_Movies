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
export class UserProfile implements OnInit{
  authService = inject(AuthService);
  favoritesService = inject(FavoritesService);

  averageRating = computed(() => {
    const scoreValues = [...this.favoritesService.ratings().values()];
    return scoreValues.length ? scoreValues.reduce((a,b)=> a + b, 0) / scoreValues.length : null;
  });

  ngOnInit(): void {
    this.favoritesService.loadFavorites();
  }
}
