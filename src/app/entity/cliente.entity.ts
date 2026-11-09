import { Cliente as ClienteModel, ClienteRequest } from '../models/cliente.models';

export class Cliente implements ClienteModel {
  idCliente = 0;
  nombres = '';
  apellidos = '';
  dni = '';
  correo = '';
  telefono = '';
  area = '';
  activo = true;

  static fromJson(json: Partial<ClienteModel>): Cliente {
    const cliente = new Cliente();
    cliente.idCliente = json.idCliente ?? 0;
    cliente.nombres = json.nombres ?? '';
    cliente.apellidos = json.apellidos ?? '';
    cliente.dni = json.dni ?? '';
    cliente.correo = json.correo ?? '';
    cliente.telefono = json.telefono ?? '';
    cliente.area = json.area ?? '';
    cliente.activo = json.activo ?? true;
    return cliente;
  }

  toRequest(): ClienteRequest {
    return {
      nombres: this.nombres,
      apellidos: this.apellidos,
      dni: this.dni,
      correo: this.correo,
      telefono: this.telefono,
      area: this.area,
    };
  }

  get nombreCompleto(): string {
    return `${this.nombres} ${this.apellidos}`.trim();
  }
}
