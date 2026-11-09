export interface Comprobante {
  idComprobante: number;
  idVenta: number;
  tipo: string;
  serie: string;
  numero: number;
  total: number;
  fechaEmision: string;
}
