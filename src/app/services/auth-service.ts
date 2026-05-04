import { Injectable, inject, signal } from '@angular/core';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private router = inject(Router);
  readonly supabase: SupabaseClient = createClient(
    environment.supabase.sbUrl,
    environment.supabase.sbKey,
  );

  currentUser = signal<User | null>(null);

  constructor() {
    this.supabase.auth.getSession().then(({ data }) => {
      this.currentUser.set(data.session?.user ?? null);
    });
    this.supabase.auth.onAuthStateChange((_, session) => {
      this.currentUser.set(session?.user ?? null);
    });
  }

  isLoggedIn = () => this.currentUser() !== null;

  async login(email: string, password: string) {
    const { error } = await this.supabase.auth.signInWithPassword({ email, password });

    if (error) throw error;
    this.router.navigate(['/']);
  }

  async loginWithGoogle() {
    const { error } = await this.supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
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
    this.router.navigate(['/login']);
  }
}
