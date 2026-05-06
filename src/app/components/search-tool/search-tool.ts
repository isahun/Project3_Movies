import { Component, inject } from '@angular/core';
import { MoviesService } from '../../services/movies-service';
import { GENRES } from '../../constants/genres';

@Component({
  selector: 'app-search-tool',
  imports: [],
  templateUrl: './search-tool.html',
  styleUrl: './search-tool.css',
})
export class SearchTool {
  moviesService = inject(MoviesService);

  // Object.entries() converteix { 28: 'Acció', 12: 'Aventura', ... } en [['28','Acció'], ['12','Aventura'], ...]
  // [id, name] és destructuring: extraiem cada parell clau-valor directament
  // Number(id) perquè Object.entries() sempre retorna les claus com a string, fins i tot si eren números
  genres = Object.entries(GENRES).map(([id, name]) => ({ id: Number(id), name }));

  onSearch(event: Event) {
    // event.target és de tipus genèric EventTarget; fem un "type cast" a HTMLInputElement
    // per dir-li a TypeScript que sabem que és un input i té la propietat .value
    const inputValue = (event.target as HTMLInputElement).value;
    this.moviesService.searchTerm.set(inputValue);
    // MoviesService.filteredMovies (computed) es recalcularà automàticament
  }

  onGenreSearch(event: Event) {
    const genreSelectValue = (event.target as HTMLSelectElement).value;
    // Si l'usuari selecciona l'opció buida ("Tots"), genreSelectValue és "" (string buit = falsy)
    // → posem null per indicar "sense filtre de gènere"
    // Si ha seleccionat un gènere, el convertim a number (els IDs de gènere són números)
    this.moviesService.selectedGenre.set(genreSelectValue ? Number(genreSelectValue) : null);
  }

  changeSort(criteria: 'date' | 'score') {
    if (this.moviesService.sortBy() === criteria) {
      // Si es clica el mateix criteri que ja estava actiu → invertim l'ordre (asc ↔ desc)
      const newOrder = this.moviesService.sortOrder() === 'asc' ? 'desc' : 'asc';
      this.moviesService.sortOrder.set(newOrder);
    } else {
      // Si és un criteri diferent → el seleccionem i resetegem a descendent per defecte
      this.moviesService.sortBy.set(criteria);
      this.moviesService.sortOrder.set('desc');
    }
  }
}
