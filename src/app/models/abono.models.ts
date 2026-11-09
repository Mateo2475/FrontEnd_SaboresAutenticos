export interface Abono {
  idAbono: number;
  idCuenta: number;
  idCliente: number;
  cliente: string;
  idEmpleado: number;
  cajero: string;
  monto: number;
  metodoPago: string;
  fechaHora: string;
}

export interface AbonoRequest {
  idCliente: number;
  monto: number;
  metodoPago: string;
}

export interface AbonoAplicado {
  idCliente: number;
  cliente: string;
  montoSolicitado: number;
  montoAplicado: number;
  deudaRestante: number;
  mensaje: string;
  abonos: Abono[];
}

export interface HistorialCobro {
  idEmpleado: number;
  cajero: string;
  fechaOperacion: string;
  tipoOperacion: string;
  metodoPago: string;
  monto: number;
}
