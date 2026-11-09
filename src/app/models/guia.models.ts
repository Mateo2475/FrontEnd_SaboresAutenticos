export interface DetalleGuiaRequest {
  idProducto: number;
  cantidad: number;
}

export interface GuiaRequest {
  numeroGuia: string;
  proveedor: string;
  idEmpleado?: number;
  detalles: DetalleGuiaRequest[];
}

export interface DetalleGuia {
  idProducto: number;
  producto: string;
  cantidad: number;
}

export interface GuiaRemision {
  idGuia: number;
  numeroGuia: string;
  proveedor: string;
  idEmpleado: number;
  empleado: string;
  fechaIngreso: string;
  detalles: DetalleGuia[];
}
