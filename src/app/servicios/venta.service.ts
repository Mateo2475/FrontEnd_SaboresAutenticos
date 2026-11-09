import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../service/api.service';
import {
  AnulacionRequest,
  MfaSolicitudResponse,
  ReporteMensual,
  Venta,
  VentaRequest,
} from '../models/venta.models';

@Injectable({ providedIn: 'root' })
export class VentaService {
  private readonly api = inject(ApiService);

  listar(): Observable<Venta[]> {
    return this.api.get<Venta[]>('/ventas');
  }

  obtener(id: number): Observable<Venta> {
    return this.api.get<Venta>(`/ventas/${id}`);
  }

  listarPorCliente(idCliente: number, page = 0, size = 20): Observable<any> {
    return this.api.get<any>(`/ventas/cliente/${idCliente}`, { page, size });
  }

  reporteMensual(): Observable<ReporteMensual[]> {
    return this.api.get<ReporteMensual[]>('/ventas/reporte-mensual');
  }

  registrar(request: VentaRequest): Observable<Venta> {
    return this.api.post<Venta>('/ventas', request);
  }

  solicitarMfa(): Observable<MfaSolicitudResponse> {
    return this.api.post<MfaSolicitudResponse>('/ventas/mfa/solicitar', {});
  }

  anular(id: number, request: AnulacionRequest): Observable<Venta> {
    return this.api.post<Venta>(`/ventas/${id}/anulacion`, request);
  }
}
