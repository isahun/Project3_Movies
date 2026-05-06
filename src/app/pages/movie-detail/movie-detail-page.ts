// Importem les utilitats d'Angular necessàries per a aquest component:
// - Component: decorador que defineix la classe com a component Angular
// - input: funció per declarar inputs del component (Angular 17+)
// - inject: funció per injectar dependències sense constructor
// - OnInit: interfície que obliga a implementar ngOnInit()
// - signal: funció per crear valors reactius (Angular Signals)
import { Component, input, inject, OnInit, signal } from '@angular/core';

// Servei que fa les crides a l'API de TMDB (The Movie Database)
import { TmdbService } from '../../services/tmdb-service';

// forkJoin fa múltiples peticions HTTP en paral·lel i espera que totes acabin
import { forkJoin } from 'rxjs';

// Interfícies per tipar les dades de l'equip artístic de la pel·lícula
import { CastMember, CrewMember } from '../../interfaces/person-detail';

// Interfícies per tipar els detalls de la pel·lícula i els proveïdors de streaming
import { MovieDetail, WatchProviderResult } from '../../interfaces/movie-detail';

// Pipes d'Angular per formatar dates i números a la plantilla HTML
import { DatePipe, DecimalPipe } from '@angular/common';

// Directiva per crear enllaços de navegació interna amb el Router d'Angular
import { RouterLink } from '@angular/router';

// DomSanitizer: servei per marcar URLs com a segures (evita errors de seguretat XSS)
// SafeResourceUrl: tipus per a URLs sanejades que es poden fer servir a iframes
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

// Funció utilitària que construeix l'URL d'embedding (iframe) per a un vídeo
import { buildVideoEmbedUrl } from '../../utils/video-url.utils';

// Servei que gestiona l'autenticació de l'usuari (login/logout, sessió activa)
import { AuthService } from '../../services/auth-service';

// Servei que gestiona la llista de pel·lícules favorites de l'usuari
import { FavoritesService } from '../../services/favorites-service';

// Interfície genèrica de pel·lícula, usada al component de favorits
import { Movie } from '../../interfaces/movie';

// Decorador @Component: configura el component Angular
@Component({
  selector: 'app-movie-detail-page', // Etiqueta HTML per usar aquest component
  imports: [DecimalPipe, DatePipe, RouterLink], // Pipes i directives usades a la plantilla
  templateUrl: './movie-detail-page.html', // Plantilla HTML associada
  styleUrl: './movie-detail-page.css', // Full d'estils associat
})
export class MovieDetailPage implements OnInit {
  // inject() és la manera moderna d'Angular per obtenir serveis (substitueix el constructor)
  private tmdbService = inject(TmdbService); // Per fer crides a l'API de TMDB
  private sanitizer = inject(DomSanitizer); // Per sanejar URLs d'iframes
  favoritesService = inject(FavoritesService); // Públic perquè la plantilla hi accedeix
  authService = inject(AuthService); // Públic perquè la plantilla hi accedeix

  // input.required<string>(): rep l'ID de la pel·lícula com a paràmetre de la ruta
  // És obligatori; Angular llençarà un error si no es passa
  movieId = input.required<string>();

  // Signals: variables reactives. Quan canvien, Angular actualitza la vista automàticament
  error = signal(false); // true si la crida a l'API falla
  movie = signal<MovieDetail | null>(null); // Dades detallades de la pel·lícula
  cast = signal<CastMember[]>([]); // Llista dels 10 primers actors
  director = signal<CrewMember | null>(null); // Director de la pel·lícula
  watchProviders = signal<WatchProviderResult | null>(null); // Plataformes de streaming

  // URL sanejada del tràiler per incrustar-la en un <iframe> a la plantilla
  trailerUrl: SafeResourceUrl | null = null;

  isLoading = signal(true); // Controla si es mostra l'indicador de càrrega

  // ngOnInit s'executa automàticament quan Angular ha inicialitzat el component
  ngOnInit() {
    // Convertim l'ID de string a number, que és el format que espera l'API de TMDB
    const movieId = Number(this.movieId());

    // Carreguem els favorits de l'usuari per saber si aquesta pel·lícula ja és favorita
    this.favoritesService.loadFavorites();

    // forkJoin llança totes les peticions HTTP alhora i només continua quan totes han respost
    // Això és molt més eficient que fer-les una per una (esperar cada resposta abans de la següent)
    forkJoin({
      movie: this.tmdbService.getMovieById(movieId), // Detalls de la pel·lícula
      credits: this.tmdbService.getMovieCredits(movieId), // Repartiment i equip tècnic
      videos: this.tmdbService.getMovieVideo(movieId), // Tràilers i teasers
      providers: this.tmdbService.getMovieWatchProviders(movieId), // On es pot veure en streaming
    }).subscribe({
      // next s'executa quan totes les peticions han respost correctament
      next: ({ movie, credits, videos, providers }) => {
        // Guardem les dades rebudes als signals corresponents
        this.movie.set(movie);

        // Agafem només els 10 primers actors per no sobrecarregar la vista
        this.cast.set(credits.cast.slice(0, 10));

        // Busquem el director dins la llista de crew; si no el trobem, posem null
        this.director.set(credits.crew.find((person) => person.job === 'Director') ?? null);

        this.watchProviders.set(providers);

        // Intentem trobar el millor vídeo per mostrar com a tràiler:
        // Primer prioritzem vídeos oficials (Trailer o Teaser) de YouTube
        // Si no n'hi ha d'oficials, agafem qualsevol Trailer o Teaser de YouTube
        const trailer =
          videos.find(
            (video) =>
              (video.type === 'Trailer' || video.type === 'Teaser') &&
              video.site === 'YouTube' &&
              video.official,
          ) ??
          videos.find(
            (video) =>
              (video.type === 'Trailer' || video.type === 'Teaser') && video.site === 'YouTube',
          );

        if (trailer) {
          // Construïm l'URL d'embedding (per a l'iframe) a partir de la clau i la plataforma
          const unsanitizedUrl = buildVideoEmbedUrl(trailer.key, trailer.site);

          // bypassSecurityTrustResourceUrl li diu a Angular que confiem en aquesta URL
          // Sense això, Angular bloqueja els iframes per protegir contra atacs XSS
          if (unsanitizedUrl)
            this.trailerUrl = this.sanitizer.bypassSecurityTrustResourceUrl(unsanitizedUrl);
        }

        // Amaguem l'indicador de càrrega un cop tenim totes les dades
        this.isLoading.set(false);
      },
      // error s'executa si qualsevol de les peticions de forkJoin falla
      error: (err) => {
        console.error('error:', err);
        this.error.set(true); // Mostrem el missatge d'error a la vista
        this.isLoading.set(false); // Amaguem el loader fins i tot si hi ha error
      },
    });
  }

  // Converteix MovieDetail (interfície detallada) a Movie (interfície genèrica)
  // Necessari perquè el component de favorits treballa amb la interfície Movie simplificada
  asMovie(): Movie | null {
    const movie = this.movie();
    if (!movie) return null;
    return {
      id: movie.id,
      title: movie.title,
      overview: movie.overview,
      poster_path: movie.poster_path,
      release_date: movie.release_date,
      vote_average: movie.vote_average,
      vote_count: 0, // MovieDetail no té vote_count; posem 0 com a valor per defecte
      original_language: '', // Ídem: no disponible en aquest context, camp obligatori a Movie
      genre_ids: movie.genres.map((genre) => genre.id), // Convertim objectes Genre a array d'IDs
    };
  }
}
