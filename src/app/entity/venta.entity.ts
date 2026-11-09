import { Comprobante } from '../models/comprobante.models';
import { DetalleVenta, TipoPago, Venta as VentaModel, VentaPago } from '../models/venta.models';

export class Venta implements VentaModel {
  idVenta = 0;
  idEmpleado = 0;
  cajero = '';
  idCliente: number | null = null;
  cliente = '';
  tipoPago: TipoPago = 'CONTADO';
  total = 0;
  estado = '';
  fechaHora = '';
  motivoAnulacion = '';
  mfaVerificado = false;
  fechaAnulacion = '';
  detalles: DetalleVenta[] = [];
  pagos: VentaPago[] = [];
  comprobante: Comprobante | null = null;

  static fromJson(json: Partial<VentaModel>): Venta {
    const venta = new Venta();
    venta.idVenta = json.idVenta ?? 0;
    venta.idEmpleado = json.idEmpleado ?? 0;
    venta.cajero = json.cajero ?? '';
    venta.idCliente = json.idCliente ?? null;
    venta.cliente = json.cliente ?? '';
    venta.tipoPago = json.tipoPago ?? 'CONTADO';
    venta.total = Number(json.total ?? 0);
    venta.estado = json.estado ?? '';
    venta.fechaHora = json.fechaHora ?? '';
    venta.motivoAnulacion = json.motivoAnulacion ?? '';
    venta.mfaVerificado = json.mfaVerificado ?? false;
    venta.fechaAnulacion = json.fechaAnulacion ?? '';
    venta.detalles = json.detalles ?? [];
    venta.pagos = json.pagos ?? [];
    venta.comprobante = json.comprobante ?? null;
    return venta;
  }

  get anulada(): boolean {
    return this.estado === 'ANULADA';
  }
}
