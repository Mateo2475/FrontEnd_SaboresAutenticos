import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { ApiService } from './api.service';
import { TokenService } from './token.service';
import {
  AuthResponse,
  LoginRequest,
  RefreshTokenRequest,
  RegisterRequest,
  Sesion,
} from '../models/auth.models';
import { MensajeResponse } from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = inject(ApiService);
  private readonly tokenService = inject(TokenService);
  private readonly router = inject(Router);

  private readonly _sesion = signal<Sesion | null>(this.tokenService.leer());

  readonly sesion = this._sesion.asReadonly();
  readonly autenticado = computed(() => {
    const sesion = this._sesion();
    return !!sesion && sesion.expiraEn > Date.now();
  });
  readonly username = computed(() => this._sesion()?.username ?? '');
  readonly roles = computed(() => this._sesion()?.roles ?? []);
  readonly esAdmin = computed(() => this.roles().includes('ADMIN'));
  readonly esContador = computed(() => this.roles().includes('CONTADOR'));
  readonly esCajero = computed(() => this.roles().includes('CAJERO'));
  readonly esAlmacenero = computed(() => this.roles().includes('ALMACENERO'));
  readonly idEmpleado = computed(() => this._sesion()?.idEmpleado ?? null);

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.api.post<AuthResponse>('/auth/login', request).pipe(
      tap((respuesta) => this._sesion.set(this.tokenService.guardar(respuesta))),
    );
  }

  register(request: RegisterRequest): Observable<MensajeResponse> {
    return this.api.post<MensajeResponse>('/auth/register', request);
  }

  refresh(): Observable<AuthResponse> {
    const refreshToken = this.tokenService.refreshToken();
    const request: RefreshTokenRequest = { refreshToken: refreshToken ?? '' };
    return this.api.post<AuthResponse>('/auth/refresh', request).pipe(
      tap((respuesta) => this._sesion.set(this.tokenService.guardar(respuesta))),
    );
  }

  logout(): void {
    this.tokenService.limpiar();
    this._sesion.set(null);
    void this.router.navigate(['/login']);
  }

  tieneRol(...roles: string[]): boolean {
    return roles.some((rol) => this.roles().includes(rol));
  }
}
