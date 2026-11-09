import { DetalleGuia as DetalleGuiaModel } from '../models/guia.models';

export class DetalleGuia implements DetalleGuiaModel {
  idProducto = 0;
  producto = '';
  cantidad = 0;

  static fromJson(json: Partial<DetalleGuiaModel>): DetalleGuia {
    const detalle = new DetalleGuia();
    detalle.idProducto = json.idProducto ?? 0;
    detalle.producto = json.producto ?? '';
    detalle.cantidad = json.cantidad ?? 0;
    return detalle;
  }
}
