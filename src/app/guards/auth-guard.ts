import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth-service';

export const authGuard: CanActivateFn = async () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const { data } = await auth.supabase.auth.getSession();

  if (data.session) return true;

  return router.createUrlTree(['/login']);
};
