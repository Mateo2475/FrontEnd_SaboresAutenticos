import { Empleado as EmpleadoModel, EmpleadoRequest } from '../models/empleado.models';

export class Empleado implements EmpleadoModel {
  idEmpleado = 0;
  username = '';
  nombres = '';
  apellidos = '';
  dni = '';
  correo = '';
  telefono = '';

  static fromJson(json: Partial<EmpleadoModel>): Empleado {
    const empleado = new Empleado();
    empleado.idEmpleado = json.idEmpleado ?? 0;
    empleado.username = json.username ?? '';
    empleado.nombres = json.nombres ?? '';
    empleado.apellidos = json.apellidos ?? '';
    empleado.dni = json.dni ?? '';
    empleado.correo = json.correo ?? '';
    empleado.telefono = json.telefono ?? '';
    return empleado;
  }

  toRequest(): EmpleadoRequest {
    return {
      nombres: this.nombres,
      apellidos: this.apellidos,
      dni: this.dni,
      correo: this.correo,
      telefono: this.telefono,
    };
  }

  get nombreCompleto(): string {
    return `${this.nombres} ${this.apellidos}`.trim();
  }
}
