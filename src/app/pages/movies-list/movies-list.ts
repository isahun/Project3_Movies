import { MoviesService } from './../../services/movies-service';
import { Component, inject } from '@angular/core';
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

  // Assignem la referència al computed signal directament (sense cridar-lo amb ()).
  // La plantilla HTML l'usarà com @for (movie of filteredMovies()) — Angular l'executa com a signal.
  // Si filteredMovies canvia (per cerca, filtre o nova pàgina), la vista es recalcula sola.
  filteredMovies = this.moviesService.filteredMovies;

  // NOTA: ngOnInit és funcional però no reactiu. Si l'usuari navegués a una altra pàgina
  // i tornés, ngOnInit tornaria a executar-se i recarregaria. Alternativa moderna: effect().
  ngOnInit() {
    this.moviesService.loadMovies();
  }
}
