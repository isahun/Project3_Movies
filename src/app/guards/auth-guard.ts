import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth-service';

// Guard funcional (Angular 14+): substitueix la classe CanActivate per una simple funció.
// CanActivateFn és el tipus que espera canActivate: [...] a les rutes.
// La funció s'executa automàticament cada vegada que algú intenta navegar a una ruta protegida.
export const authGuard: CanActivateFn = async () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // getSession() consulta Supabase si hi ha una sessió activa (token guardat al localStorage).
  // És async (retorna una Promise), per això el guard és async i fem await.
  const { data } = await auth.supabase.auth.getSession();

  // Si hi ha sessió → retornem true → Angular permet la navegació
  if (data.session) return true;

  // Si no hi ha sessió → retornem un UrlTree en lloc de false.
  // Retornar un UrlTree fa que Angular redirigeixi l'usuari a /login directament.
  // És millor que retornar false (que simplement bloqueja sense fer res).
  return router.createUrlTree(['/login']);
};
