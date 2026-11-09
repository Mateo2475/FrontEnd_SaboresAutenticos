import { DetalleVenta as DetalleVentaModel } from '../models/venta.models';

export class DetalleVenta implements DetalleVentaModel {
  idProducto = 0;
  producto = '';
  cantidad = 0;
  precioUnitario = 0;
  subtotal = 0;

  static fromJson(json: Partial<DetalleVentaModel>): DetalleVenta {
    const detalle = new DetalleVenta();
    detalle.idProducto = json.idProducto ?? 0;
    detalle.producto = json.producto ?? '';
    detalle.cantidad = json.cantidad ?? 0;
    detalle.precioUnitario = Number(json.precioUnitario ?? 0);
    detalle.subtotal = Number(json.subtotal ?? 0);
    return detalle;
  }
}
