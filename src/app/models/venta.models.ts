import { Comprobante } from './comprobante.models';

export type TipoPago = 'CONTADO' | 'CREDITO';

export interface ItemCarrito {
  idProducto: number;
  cantidad: number;
}

export interface PagoVenta {
  metodoPago: string;
  monto: number;
}

export interface VentaRequest {
  idCliente?: number | null;
  tipoPago: TipoPago;
  items: ItemCarrito[];
  pagos?: PagoVenta[];
}

export interface DetalleVenta {
  idProducto: number;
  producto: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface VentaPago {
  metodoPago: string;
  monto: number;
}

export interface Venta {
  idVenta: number;
  idEmpleado: number;
  cajero: string;
  idCliente?: number | null;
  cliente?: string;
  tipoPago: TipoPago;
  total: number;
  estado: string;
  fechaHora: string;
  motivoAnulacion?: string;
  mfaVerificado: boolean;
  fechaAnulacion?: string;
  detalles: DetalleVenta[];
  pagos: VentaPago[];
  comprobante?: Comprobante | null;
}

export interface AnulacionRequest {
  motivo: string;
  codigoMfa: string;
}

export interface MfaSolicitudResponse {
  codigo: string;
  expiraEnSegundos: number;
  mensaje: string;
}

export interface ReporteMensual {
  anio: number;
  mes: number;
  tipoPago: string;
  cantidadVentas: number;
  totalRecaudado: number;
}
