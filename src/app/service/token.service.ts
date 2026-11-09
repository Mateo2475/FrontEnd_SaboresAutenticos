import { Injectable } from '@angular/core';
import { AuthResponse, Sesion } from '../models/auth.models';

const CLAVE_SESION = 'sabores_autenticos_sesion';

@Injectable({ providedIn: 'root' })
export class TokenService {
  guardar(auth: AuthResponse): Sesion {
    const sesion: Sesion = {
      username: auth.username,
      roles: auth.roles ?? [],
      token: auth.token,
      refreshToken: auth.refreshToken,
      expiraEn: Date.now() + auth.expiraEnSegundos * 1000,
      idEmpleado: auth.idEmpleado ?? null,
    };
    localStorage.setItem(CLAVE_SESION, JSON.stringify(sesion));
    return sesion;
  }

  leer(): Sesion | null {
    const raw = localStorage.getItem(CLAVE_SESION);
    if (!raw) {
      return null;
    }
    try {
      return JSON.parse(raw) as Sesion;
    } catch {
      this.limpiar();
      return null;
    }
  }

  token(): string | null {
    return this.leer()?.token ?? null;
  }

  refreshToken(): string | null {
    return this.leer()?.refreshToken ?? null;
  }

  estaVigente(): boolean {
    const sesion = this.leer();
    return !!sesion && sesion.expiraEn > Date.now();
  }

  limpiar(): void {
    localStorage.removeItem(CLAVE_SESION);
  }
}
