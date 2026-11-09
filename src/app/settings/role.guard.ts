import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';

export const roleGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const roles = (route.data['roles'] as string[] | undefined) ?? [];
  if (roles.length === 0 || authService.tieneRol(...roles)) {
    return true;
  }
  return router.createUrlTree(['/forbidden']);
};
