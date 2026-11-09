import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../service/api.service';
import { Comprobante } from '../models/comprobante.models';

@Injectable({ providedIn: 'root' })
export class ComprobanteService {
  private readonly api = inject(ApiService);

  listar(desde?: string, hasta?: string): Observable<Comprobante[]> {
    return this.api.get<Comprobante[]>('/comprobantes', { desde, hasta });
  }

  obtener(id: number): Observable<Comprobante> {
    return this.api.get<Comprobante>(`/comprobantes/${id}`);
  }

  porVenta(idVenta: number): Observable<Comprobante[]> {
    return this.api.get<Comprobante[]>(`/comprobantes/venta/${idVenta}`);
  }

  descargarPdf(id: number): Observable<Blob> {
    return this.api.descargar(`/comprobantes/${id}/pdf`);
  }

  reimprimir(id: number): Observable<Blob> {
    return this.api.descargar(`/comprobantes/${id}/reimprimir`);
  }
}
