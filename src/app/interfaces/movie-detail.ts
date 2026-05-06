// Dades detallades d'una pel·lícula (resposta del endpoint /movie/:id de TMDB).
// Té més camps que la interfície Movie bàsica, que s'usa a les llistes.
export interface MovieDetail {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string; // Imatge de fons gran (per a la capçalera del detall)
  release_date: string;
  runtime: number;       // Durada en minuts
  vote_average: number;
  tagline: string;       // El lema/eslògan de la pel·lícula
  genres: { id: number; name: string }[]; // Array d'objectes inline (no interfície separada)
}

export interface Video {
  id: string;
  key: string;    // Identificador del vídeo a la plataforma (p.ex. 'dQw4w9WgXcQ' per YouTube)
  name: string;
  site: string;   // Plataforma: 'YouTube', 'Vimeo', etc.
  type: string;   // 'Trailer', 'Teaser', 'Clip', 'Featurette'...
  official: boolean;
}

export interface WatchProvider {
  logo_path: string;
  provider_id: number;
  provider_name: string;
  display_priority: number; // Ordre de visualització preferit per TMDB
}

// Resultat de proveïdors de streaming per a una regió (p.ex. 'ES')
export interface WatchProviderResult {
  link: string;              // URL directe a la pàgina de JustWatch per a aquesta pel·lícula
  flatrate?: WatchProvider[]; // ? = opcional: plataformes de subscripció (Netflix, HBO...)
  rent?: WatchProvider[];     // Plataformes on es pot llogar
  buy?: WatchProvider[];      // Plataformes on es pot comprar
  // No totes les pel·lícules estan disponibles per totes les vies a totes les regions
}
