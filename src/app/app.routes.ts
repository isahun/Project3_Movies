import { Routes } from '@angular/router';
import { Shell } from './pages/shell/shell';
import { Home } from './pages/home/home';
import { MoviesList } from './pages/movies-list/movies-list';
import { MovieDetailPage } from './pages/movie-detail/movie-detail-page';
import { Favorites } from './pages/favorites/favorites';
import { UserProfile } from './pages/user-profile/user-profile';
import { UserLogin } from './pages/user-login/user-login';
import { UserRegister } from './pages/user-register/user-register';
import { NotFound } from './pages/not-found/not-found';
import { ActorDetail } from './pages/actor-detail/actor-detail';
import { DirectorDetail } from './pages/director-detail/director-detail';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  {
    // Patró "Shell": Shell és el component pare (navbar + footer).
    // Totes les rutes "children" es renderitzen DINS de Shell, al seu <router-outlet>.
    // Això evita repetir la navbar a cada pàgina.
    path: '',
    component: Shell,
    children: [
      { path: '', component: Home },
      { path: 'movies', component: MoviesList },

      // :movieId és un paràmetre dinàmic de la URL (p.ex. /movie/550).
      // Gràcies a withComponentInputBinding() a app.config.ts, MovieDetailPage el rep com a input().
      { path: 'movie/:movieId', component: MovieDetailPage },
      { path: 'actor/:actorId', component: ActorDetail },
      { path: 'director/:directorId', component: DirectorDetail },

      // canActivate: executa authGuard ABANS de carregar el component.
      // Si l'usuari no ha iniciat sessió, el guard el redirigeix a /login automàticament.
      { path: 'favorites', component: Favorites, canActivate: [authGuard] },
      { path: 'user-profile', component: UserProfile, canActivate: [authGuard] },
    ],
  },

  // login i register estan FORA de Shell: no volen navbar ni footer
  { path: 'login', component: UserLogin },
  { path: 'register', component: UserRegister },

  // '**' és la ruta comodí: captura qualsevol URL que no coincideixi amb cap de les anteriors → pàgina 404
  { path: '**', component: NotFound },
];
