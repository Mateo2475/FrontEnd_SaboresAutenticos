export interface ApiError {
  error: string;
  status?: number;
}

export interface MensajeResponse {
  mensaje: string;
}

export interface StockResponse {
  idProducto: number;
  stockDisponible: number;
}
