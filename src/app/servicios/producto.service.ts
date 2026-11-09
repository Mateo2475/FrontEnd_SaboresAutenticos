import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../service/api.service';
import {
  AlertaInventario,
  Producto,
  ProductoRequest,
  RankingProducto,
} from '../models/producto.models';
import { MensajeResponse, StockResponse } from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class ProductoService {
  private readonly api = inject(ApiService);

  listar(): Observable<Producto[]> {
    return this.api.get<Producto[]>('/productos');
  }

  buscar(nombre: string): Observable<Producto[]> {
    return this.api.get<Producto[]>('/productos/buscar', { nombre });
  }

  consultarStock(id: number): Observable<StockResponse> {
    return this.api.get<StockResponse>(`/productos/${id}/stock`);
  }

  ranking(): Observable<RankingProducto[]> {
    return this.api.get<RankingProducto[]>('/productos/ranking-ventas');
  }

  alertas(): Observable<AlertaInventario[]> {
    return this.api.get<AlertaInventario[]>('/productos/alertas');
  }

  crear(producto: ProductoRequest): Observable<Producto> {
    return this.api.post<Producto>('/productos', producto);
  }

  actualizar(id: number, producto: ProductoRequest): Observable<Producto> {
    return this.api.put<Producto>(`/productos/${id}`, producto);
  }

  desactivar(id: number): Observable<MensajeResponse> {
    return this.api.delete<MensajeResponse>(`/productos/${id}`);
  }
}
