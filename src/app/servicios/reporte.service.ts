import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../service/api.service';
import { CuentaCredito } from '../models/credito.models';
import { RankingProducto } from '../models/producto.models';
import { VentasReporte } from '../models/reporte.models';

@Injectable({ providedIn: 'root' })
export class ReporteService {
  private readonly api = inject(ApiService);

  ventas(desde?: string, hasta?: string): Observable<VentasReporte> {
    return this.api.get<VentasReporte>('/reportes/ventas', { desde, hasta });
  }

  creditos(): Observable<CuentaCredito[]> {
    return this.api.get<CuentaCredito[]>('/reportes/creditos');
  }

  productos(): Observable<RankingProducto[]> {
    return this.api.get<RankingProducto[]>('/reportes/productos');
  }

  descargarVentas(desde?: string, hasta?: string, formato: 'excel' | 'pdf' = 'excel'): Observable<Blob> {
    return this.api.descargar(`/reportes/ventas/${formato}`, { desde, hasta });
  }

  descargarCreditos(formato: 'excel' | 'pdf' = 'excel'): Observable<Blob> {
    return this.api.descargar(`/reportes/creditos/${formato}`);
  }

  descargarProductos(formato: 'excel' | 'pdf' = 'excel'): Observable<Blob> {
    return this.api.descargar(`/reportes/productos/${formato}`);
  }

  descargarCliente(idCliente: number): Observable<Blob> {
    return this.api.descargar(`/reportes/cliente/${idCliente}/pdf`);
  }
}
