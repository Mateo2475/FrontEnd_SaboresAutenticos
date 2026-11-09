import { CuentaCredito as CuentaCreditoModel } from '../models/credito.models';

export class CuentaCredito implements CuentaCreditoModel {
  idCliente = 0;
  nombres = '';
  apellidos = '';
  dni = '';
  year = 0;
  month = 0;
  limiteCredito = 0;
  montoConsumido = 0;
  montoAbonado = 0;
  deudaPendiente = 0;
  saldoDisponible = 0;
  estadoDeuda = '';

  static fromJson(json: Partial<CuentaCreditoModel>): CuentaCredito {
    const cuenta = new CuentaCredito();
    cuenta.idCliente = json.idCliente ?? 0;
    cuenta.nombres = json.nombres ?? '';
    cuenta.apellidos = json.apellidos ?? '';
    cuenta.dni = json.dni ?? '';
    cuenta.year = json.year ?? 0;
    cuenta.month = json.month ?? 0;
    cuenta.limiteCredito = Number(json.limiteCredito ?? 0);
    cuenta.montoConsumido = Number(json.montoConsumido ?? 0);
    cuenta.montoAbonado = Number(json.montoAbonado ?? 0);
    cuenta.deudaPendiente = Number(json.deudaPendiente ?? 0);
    cuenta.saldoDisponible = Number(json.saldoDisponible ?? 0);
    cuenta.estadoDeuda = json.estadoDeuda ?? '';
    return cuenta;
  }

  get cliente(): string {
    return `${this.nombres} ${this.apellidos}`.trim();
  }

  get periodo(): string {
    return `${this.year}-${String(this.month).padStart(2, '0')}`;
  }
}
