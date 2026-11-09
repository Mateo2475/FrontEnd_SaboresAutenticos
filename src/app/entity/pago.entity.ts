import { VentaPago } from '../models/venta.models';

export class Pago implements VentaPago {
  metodoPago = 'EFECTIVO';
  monto = 0;

  static fromJson(json: Partial<VentaPago>): Pago {
    const pago = new Pago();
    pago.metodoPago = json.metodoPago ?? 'EFECTIVO';
    pago.monto = Number(json.monto ?? 0);
    return pago;
  }
}
