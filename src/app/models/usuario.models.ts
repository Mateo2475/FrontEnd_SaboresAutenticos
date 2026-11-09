export interface Usuario {
  username: string;
  enabled: boolean;
  intentosFallidos: number;
  bloqueadoHasta: string;
  roles: string[];
}
