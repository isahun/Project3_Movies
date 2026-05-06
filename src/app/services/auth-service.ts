import { Injectable, inject, signal } from '@angular/core';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

// providedIn: 'root' → Angular crea UNA SOLA instància d'aquest servei per a tota l'app (singleton).
// Tots els components que injectin AuthService compartiran el mateix objecte i el mateix estat.
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private router = inject(Router);

  // Client de Supabase: és l'objecte principal per interactuar amb la base de dades i l'autenticació.
  // readonly perquè el client no s'ha de substituir mai, però sí compartir (FavoritesService l'usa).
  // Les credencials vénen de l'arxiu environment (mai hardcodeades al codi).
  readonly supabase: SupabaseClient = createClient(
    environment.supabase.sbUrl,
    environment.supabase.sbKey,
  );

  // Signal que representa l'usuari autenticat en temps real. null = no autenticat.
  currentUser = signal<User | null>(null);

  constructor() {
    // Quan l'app s'inicia, recuperem la sessió existent del localStorage (si l'usuari ja havia fet login).
    // getSession() és asíncrona (Promise), per això fem .then() per actualitzar el signal quan acabi.
    this.supabase.auth.getSession().then(({ data }) => {
      this.currentUser.set(data.session?.user ?? null);
      //                                 ^^ operador optional chaining: si session és null, no peta
    });

    // Listener d'esdeveniments d'autenticació: s'executa cada vegada que l'estat canvia
    // (login, logout, token refresh, login amb Google que torna de la redirecció...).
    // Necessitem TANT el getSession inicial com aquest listener:
    // getSession → restaura sessió en recarregar la pàgina
    // onAuthStateChange → detecta logins/logouts en temps real
    this.supabase.auth.onAuthStateChange((_, session) => {
      this.currentUser.set(session?.user ?? null);
    });
  }

  // Funció fletxa com a propietat de classe: evita problemes amb 'this' si es passa com a callback
  isLoggedIn = () => this.currentUser() !== null;

  // async/await: sintaxi moderna per treballar amb Promises sense .then()
  // Si Supabase retorna un error, el llencem per a que el component que ha cridat login() el pugui capturar
  async login(email: string, password: string) {
    const { error } = await this.supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    this.router.navigate(['/']);
  }

  async loginWithGoogle() {
    const { error } = await this.supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        // Després del login amb Google, Supabase redirigeix l'usuari de tornada a aquesta URL.
        // window.location.origin és el domini actual (p.ex. http://localhost:4200)
        redirectTo: window.location.origin,
      },
    });
    if (error) throw error;
  }

  async register(email: string, password: string) {
    const { error } = await this.supabase.auth.signUp({ email, password });
    if (error) throw error;
    this.router.navigate(['/']);
  }

  async logout() {
    await this.supabase.auth.signOut();
    // onAuthStateChange detectarà el logout i posarà currentUser a null automàticament
    this.router.navigate(['/login']);
  }
}
