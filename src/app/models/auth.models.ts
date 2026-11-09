export type Rol = 'ADMIN' | 'CAJERO' | 'ALMACENERO' | 'CONTADOR';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  rol: Rol;
  nombres: string;
  apellidos: string;
  dni: string;
  correo?: string;
  telefono?: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  username: string;
  roles: string[];
  expiraEnSegundos: number;
  idEmpleado?: number | null;
}

export interface Sesion {
  username: string;
  roles: string[];
  token: string;
  refreshToken: string;
  expiraEn: number;
  idEmpleado?: number | null;
}
