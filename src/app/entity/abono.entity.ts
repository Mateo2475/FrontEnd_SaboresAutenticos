import { Abono as AbonoModel } from '../models/abono.models';

export class Abono implements AbonoModel {
  idAbono = 0;
  idCuenta = 0;
  idCliente = 0;
  cliente = '';
  idEmpleado = 0;
  cajero = '';
  monto = 0;
  metodoPago = '';
  fechaHora = '';

  static fromJson(json: Partial<AbonoModel>): Abono {
    const abono = new Abono();
    abono.idAbono = json.idAbono ?? 0;
    abono.idCuenta = json.idCuenta ?? 0;
    abono.idCliente = json.idCliente ?? 0;
    abono.cliente = json.cliente ?? '';
    abono.idEmpleado = json.idEmpleado ?? 0;
    abono.cajero = json.cajero ?? '';
    abono.monto = Number(json.monto ?? 0);
    abono.metodoPago = json.metodoPago ?? '';
    abono.fechaHora = json.fechaHora ?? '';
    return abono;
  }
}
