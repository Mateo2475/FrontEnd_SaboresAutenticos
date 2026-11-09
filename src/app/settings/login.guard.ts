import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';

export const loginGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.autenticado()) {
    return true;
  }
  return router.createUrlTree([authService.esAlmacenero() ? '/inventario' : '/dashboard']);
};
