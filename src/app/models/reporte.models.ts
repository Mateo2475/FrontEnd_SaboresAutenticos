import { CuentaCredito } from './credito.models';
import { RankingProducto } from './producto.models';

export interface DeudorDashboard {
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
  estadoDeuda: string;
}

export interface DashboardResumen {
  totalPorCobrar: number;
  clientesConDeuda: number;
  ventasHoy: number;
  cantidadVentasHoy: number;
  comprobantesHoy: number;
  totalPorCobrarFormateado: string;
  topDeudores: DeudorDashboard[];
}

export interface VentasReporte {
  desde: string;
  hasta: string;
  cantidadVentas: number;
  totalVendido: number;
  porTipoPago: Array<{ tipoPago: string; cantidad: number; total: number }>;
  porDia: Array<{ dia: string; cantidad: number; total: number }>;
}

export interface AlertaDeuda {
  idCliente: number;
  cliente: string;
  dni: string;
  deudaPendiente: number;
}

export interface EnvioAlerta {
  cliente: string;
  canal: string;
  destino: string;
  mensaje: string;
  intentos: number;
  estado: string;
  fechaHora: string;
}

export interface CreditosPendientes {
  creditos: CuentaCredito[];
  productos: RankingProducto[];
}
