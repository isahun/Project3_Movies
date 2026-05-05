# Movies App

Aplicació web de gestió de preferències cinematogràfiques. Permet explorar pel·lícules en temps real, consultar fitxes completes d'actors i directors, i gestionar una llista personal de favorites amb puntuació pròpia.

---

## Característiques principals

- Llistat de pel·lícules populars en temps real (API TMDB)
- Cerca per títol, filtratge per gènere i ordenació per puntuació o data
- Paginació del catàleg
- Fitxa de detall de pel·lícula: sinopsi, repartiment, director, tràiler i plataformes de streaming
- Fitxa de detall d'actor i director amb filmografia
- Sistema d'autenticació: registre, login amb email/contrasenya i login amb Google
- Àrea privada de favorites: afegir/eliminar i puntuar de l'1 al 10
- Rànquing personal de favorites ordenat per puntuació
- Disseny responsive mobile-first

---

## Stack tecnològic

| Capa | Tecnologia |
|------|-----------|
| Framework | Angular 21 (standalone components) |
| Estils | Tailwind CSS 4 |
| Autenticació i BD | Supabase (Auth + PostgreSQL) |
| API de pel·lícules | TMDB (The Movie Database) |
| Testing | Vitest + Angular TestBed |
| Desplegament | — |

---

## Instal·lació i posada en marxa

### Prerequisits

- Node.js ≥ 18
- npm ≥ 11

### 1. Clona el repositori

```bash
git clone <url-del-repo>
cd Project3_Movies
```

### 2. Instal·la les dependències

```bash
npm install
```

### 3. Configura les variables d'entorn

Crea el fitxer `src/environments/environment.ts` (i `environment.development.ts` per a dev):

```typescript
export const environment = {
  apiUrl: 'https://api.themoviedb.org/3',
  accessToken: 'EL_TEU_TOKEN_TMDB',
  supabaseUrl: 'LA_TEVA_URL_SUPABASE',
  supabaseKey: 'LA_TEVA_CLAU_SUPABASE',
};
```

> Pots obtenir el token de TMDB a [developer.themoviedb.org](https://developer.themoviedb.org) i les claus de Supabase al teu projecte a [supabase.com](https://supabase.com).

### 4. Configura la base de dades (Supabase)

Crea la taula `favorites` al teu projecte Supabase:

```sql
create table favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  movie_id integer not null,
  movie_data jsonb not null,
  rating integer,
  created_at timestamp with time zone default now()
);

alter table favorites enable row level security;

create policy "Users can manage their own favorites"
  on favorites for all
  using (auth.uid() = user_id);
```

### 5. Arrenca el servidor de desenvolupament

```bash
ng serve
```

Obre `http://localhost:4200` al navegador.

---

## Estructura del projecte

```
src/app/
├── components/
│   ├── movie-card/        # Targeta de pel·lícula reutilitzable
│   └── search-tool/       # Barra de cerca, filtres i ordenació
├── guards/
│   └── auth-guard.ts      # Protecció de rutes privades
├── interfaces/            # Tipat: Movie, MovieDetail, PersonDetail...
├── pages/
│   ├── home/              # Pàgina d'inici
│   ├── movies-list/       # Catàleg de pel·lícules
│   ├── movie-detail/      # Fitxa de pel·lícula
│   ├── actor-detail/      # Fitxa d'actor
│   ├── director-detail/   # Fitxa de director
│   ├── favorites/         # Llista personal de favorites (privada)
│   ├── user-login/        # Login
│   ├── user-register/     # Registre
│   ├── user-profile/      # Perfil d'usuari (privat)
│   ├── shell/             # Layout principal (navbar + router-outlet)
│   └── not-found/         # Pàgina 404
├── services/
│   ├── auth-service.ts    # Autenticació via Supabase
│   ├── tmdb-service.ts    # Crides a l'API de TMDB
│   ├── movies-service.ts  # Estat global del catàleg (signals)
│   └── favorites-service.ts # Favorites i puntuacions (signals + Supabase)
├── constants/
│   └── genres.ts          # Mapa d'id → nom de gènere TMDB
└── utils/
    └── video-url.utils.ts # Generació d'URL d'embed de YouTube
```

---

## Rutes

| Ruta | Component | Accés |
|------|-----------|-------|
| `/` | Home | Públic |
| `/movies` | MoviesList | Públic |
| `/movie/:movieId` | MovieDetailPage | Públic |
| `/actor/:actorId` | ActorDetail | Públic |
| `/director/:directorId` | DirectorDetail | Públic |
| `/favorites` | Favorites | Privat (authGuard) |
| `/user-profile` | UserProfile | Privat (authGuard) |
| `/login` | UserLogin | Públic |
| `/register` | UserRegister | Públic |
| `/**` | NotFound | — |

---

## Tests

```bash
# Executar tots els tests
ng test

# Mode watch
ng test --watch
```

Els tests utilitzen **Vitest** amb **Angular TestBed** en un entorn jsdom compartit.

---

## Scripts disponibles

| Comanda | Descripció |
|---------|-----------|
| `ng serve` | Servidor de desenvolupament |
| `ng build` | Build de producció |
| `ng test` | Execució de tests unitaris |
| `ng generate component <nom>` | Genera un nou component |
