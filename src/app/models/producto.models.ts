export interface Producto {
  idProducto: number;
  idCategoria?: number;
  nombre: string;
  categoria: string;
  precio: number;
  stock: number;
  stockMinimo: number;
  activo: boolean;
  disponible: boolean;
  fechaCaducidad?: string;
}

export interface ProductoRequest {
  nombre: string;
  precio: number;
  stock: number;
  stockMinimo: number;
  activo: boolean;
  fechaCaducidad?: string;
  categoria: { idCategoria: number };
}

export interface AlertaInventario {
  idProducto: number;
  nombre: string;
  categoria: string;
  stock: number;
  stockMinimo: number;
  fechaCaducidad?: string;
  estadoStock: string;
  estadoCaducidad: string;
}

export interface RankingProducto {
  idProducto: number;
  nombre: string;
  categoria: string;
  totalUnidadesVendidas: number;
  ingresoTotalGenerado: number;
}
