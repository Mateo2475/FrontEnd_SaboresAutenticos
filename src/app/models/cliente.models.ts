export interface Cliente {
  idCliente: number;
  nombres: string;
  apellidos: string;
  dni: string;
  correo?: string;
  telefono?: string;
  area?: string;
  activo: boolean;
}

export interface ClienteRequest {
  nombres: string;
  apellidos: string;
  dni: string;
  correo?: string;
  telefono?: string;
  area?: string;
}
