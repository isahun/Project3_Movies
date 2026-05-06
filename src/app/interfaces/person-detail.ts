// Dades biogràfiques d'una persona (actor, director...) del endpoint /person/:id
export interface PersonDetail {
  id: number;
  name: string;
  biography: string;
  birthday: string | null;         // null si TMDB no en té registre
  place_of_birth: string | null;   // null si no és conegut
  profile_path: string | null;     // null si no hi ha foto de perfil
  known_for_department: string;    // 'Acting', 'Directing', 'Writing'...
}

// Un membre del repartiment (actor/actriu) en una pel·lícula concreta
export interface CastMember {
  id: number;
  name: string;
  character: string;       // Nom del personatge que interpreta
  profile_path: string | null;
  order: number;           // Posició als crèdits (0 = protagonista principal)
}

// Un membre de l'equip tècnic (director, guionista, editor...) en una pel·lícula concreta
export interface CrewMember {
  id: number;
  name: string;
  job: string;             // Feina específica: 'Director', 'Screenplay', 'Editor'...
  department: string;      // Departament: 'Directing', 'Writing', 'Editing'...
  profile_path: string | null;
}

// Resposta del endpoint /movie/:id/credits: combina cast i crew en un sol objecte
export interface Credits {
  cast: CastMember[];
  crew: CrewMember[];
}

// Pel·lícula on una persona ha actuat (de la perspectiva de la persona, no de la pel·lícula)
export interface PersonMovieCredit {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  character: string;   // El personatge que va interpretar en aquesta pel·lícula
  vote_average: number;
}

// Pel·lícula on una persona ha treballat en l'equip tècnic
export interface PersonCrewCredit {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  job: string;         // p.ex. 'Director', 'Producer'
  department: string;
  vote_average: number;
}

// Resposta del endpoint /person/:id/movie_credits
// Agrupa totes les pel·lícules d'una persona com a actor i com a tècnic
export interface PersonMovieCredits {
  cast: PersonMovieCredit[];
  crew: PersonCrewCredit[];
}
