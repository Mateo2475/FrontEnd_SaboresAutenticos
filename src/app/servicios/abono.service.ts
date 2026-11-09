import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../service/api.service';
import { Abono, AbonoAplicado, AbonoRequest, HistorialCobro } from '../models/abono.models';

@Injectable({ providedIn: 'root' })
export class AbonoService {
  private readonly api = inject(ApiService);

  listar(): Observable<Abono[]> {
    return this.api.get<Abono[]>('/abonos');
  }

  registrar(request: AbonoRequest): Observable<AbonoAplicado> {
    return this.api.post<AbonoAplicado>('/abonos', request);
  }

  historialCajero(idEmpleado: number): Observable<HistorialCobro[]> {
    return this.api.get<HistorialCobro[]>(`/abonos/historial-cajero/${idEmpleado}`);
  }

  descargarHistorialCajero(idEmpleado: number, desde?: string, hasta?: string): Observable<Blob> {
    return this.api.descargar(`/abonos/historial-cajero/${idEmpleado}/pdf`, { desde, hasta });
  }
}
