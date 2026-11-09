import { DetalleGuia, GuiaRemision as GuiaRemisionModel } from '../models/guia.models';

export class GuiaRemision implements GuiaRemisionModel {
  idGuia = 0;
  numeroGuia = '';
  proveedor = '';
  idEmpleado = 0;
  empleado = '';
  fechaIngreso = '';
  detalles: DetalleGuia[] = [];

  static fromJson(json: Partial<GuiaRemisionModel>): GuiaRemision {
    const guia = new GuiaRemision();
    guia.idGuia = json.idGuia ?? 0;
    guia.numeroGuia = json.numeroGuia ?? '';
    guia.proveedor = json.proveedor ?? '';
    guia.idEmpleado = json.idEmpleado ?? 0;
    guia.empleado = json.empleado ?? '';
    guia.fechaIngreso = json.fechaIngreso ?? '';
    guia.detalles = json.detalles ?? [];
    return guia;
  }

  get totalUnidades(): number {
    return this.detalles.reduce((total, detalle) => total + detalle.cantidad, 0);
  }
}
