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

export const routes: Routes = [{
  path: '',
  component: Shell, children: [
    { path: '', component: Home },
    { path: 'movies', component: MoviesList },
    { path: 'movie/:movieId', component: MovieDetailPage },
    { path: 'actor/:actorId', component: ActorDetail },
    { path: 'director/:directorId', component: DirectorDetail },
    { path: 'favorites', component: Favorites, canActivate: [authGuard] },
    { path: 'user-profile', component: UserProfile, canActivate: [authGuard] },
  ]
},
    { path: 'login', component: UserLogin },
    { path: 'register', component: UserRegister },
    { path: '**', component: NotFound },
];
