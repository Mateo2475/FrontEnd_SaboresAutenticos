import { Comprobante as ComprobanteModel } from '../models/comprobante.models';

export class Comprobante implements ComprobanteModel {
  idComprobante = 0;
  idVenta = 0;
  tipo = '';
  serie = '';
  numero = 0;
  total = 0;
  fechaEmision = '';

  static fromJson(json: Partial<ComprobanteModel>): Comprobante {
    const comprobante = new Comprobante();
    comprobante.idComprobante = json.idComprobante ?? 0;
    comprobante.idVenta = json.idVenta ?? 0;
    comprobante.tipo = json.tipo ?? '';
    comprobante.serie = json.serie ?? '';
    comprobante.numero = json.numero ?? 0;
    comprobante.total = Number(json.total ?? 0);
    comprobante.fechaEmision = json.fechaEmision ?? '';
    return comprobante;
  }

  get numeroCompleto(): string {
    return `${this.serie}-${String(this.numero).padStart(8, '0')}`;
  }
}
