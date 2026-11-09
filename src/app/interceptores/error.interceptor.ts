import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiError } from '../models/api.models';
import { TokenService } from '../service/token.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const tokenService = inject(TokenService);

  return next(req).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse) {
        const mensaje = extraerMensaje(error);

        if (error.status === 401 && !req.url.includes('/auth/login')) {
          tokenService.limpiar();
          void router.navigate(['/login']);
        }

        const apiError: ApiError = {
          error: mensaje,
          status: error.status,
        };
        return throwError(() => apiError);
      }
      return throwError(() => error);
    }),
  );
};

function extraerMensaje(error: HttpErrorResponse): string {
  const cuerpo: unknown = error.error;

  if (typeof cuerpo === 'string' && cuerpo.trim().length > 0) {
    return cuerpo;
  }
  if (cuerpo && typeof cuerpo === 'object') {
    const objeto = cuerpo as Record<string, unknown>;
    const mensaje = objeto['error'] ?? objeto['message'];
    if (typeof mensaje === 'string') {
      return mensaje;
    }
  }
  if (error.status === 0) {
    return 'No se pudo conectar con el servidor. Verifique que el backend esté en ejecución.';
  }
  if (error.status === 403) {
    return 'No tiene permisos para realizar esta acción.';
  }
  return error.message || 'Ocurrió un error inesperado.';
}
