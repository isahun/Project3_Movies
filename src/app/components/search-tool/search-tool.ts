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
  genres = Object.entries(GENRES).map(([id, name]) => ({ id: Number(id), name: name}));


  onSearch(event: Event) {
    const inputValue = (event.target as HTMLInputElement).value;
    this.moviesService.searchTerm.set(inputValue);
  }

  onGenreSearch(event: Event) {
    const genreSelectValue = (event.target as HTMLSelectElement).value;
    this.moviesService.selectedGenre.set(genreSelectValue ? Number(genreSelectValue): null);
  }

  changeSort(criteria: 'date' | 'score') {
    if (this.moviesService.sortBy() === criteria) {
      const newOrder = this.moviesService.sortOrder() === 'asc' ? 'desc' : 'asc';
      this.moviesService.sortOrder.set(newOrder);
    } else {
      this.moviesService.sortBy.set(criteria);
      this.moviesService.sortOrder.set('desc');
    }
  }
}
