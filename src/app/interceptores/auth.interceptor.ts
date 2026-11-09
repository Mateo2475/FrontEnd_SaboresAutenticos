import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';
import { API_BASE_URL } from '../service/api.service';
import { AuthService } from '../service/auth.service';
import { TokenService } from '../service/token.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!req.url.startsWith(API_BASE_URL)) {
    return next(req);
  }

  const token = tokenService.token();
  const authReq = token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;

  return next(authReq).pipe(
    catchError((error: unknown) => {
      if (
        error instanceof HttpErrorResponse &&
        error.status === 401 &&
        !req.url.includes('/auth/login') &&
        !req.url.includes('/auth/refresh')
      ) {
        return authService.refresh().pipe(
          switchMap(() => {
            const nuevoToken = tokenService.token();
            const reintento = nuevoToken
              ? req.clone({ setHeaders: { Authorization: `Bearer ${nuevoToken}` } })
              : req;
            return next(reintento);
          }),
          catchError((refreshError: unknown) => {
            tokenService.limpiar();
            void router.navigate(['/login']);
            return throwError(() => refreshError);
          }),
        );
      }
      return throwError(() => error);
    }),
  );
};
