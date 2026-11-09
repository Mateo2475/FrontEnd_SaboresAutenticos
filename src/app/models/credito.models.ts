export interface CuentaCredito {
  idCliente: number;
  nombres: string;
  apellidos: string;
  dni: string;
  year: number;
  month: number;
  limiteCredito: number;
  montoConsumido: number;
  montoAbonado: number;
  deudaPendiente: number;
  saldoDisponible: number;
  estadoDeuda: string;
}
