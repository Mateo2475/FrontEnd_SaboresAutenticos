export interface Empleado {
  idEmpleado: number;
  username?: string;
  nombres: string;
  apellidos: string;
  dni: string;
  correo?: string;
  telefono?: string;
}

export interface EmpleadoRequest {
  nombres: string;
  apellidos: string;
  dni: string;
  correo?: string;
  telefono?: string;
}
