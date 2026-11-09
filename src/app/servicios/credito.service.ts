import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../service/api.service';
import { CuentaCredito } from '../models/credito.models';

@Injectable({ providedIn: 'root' })
export class CreditoService {
  private readonly api = inject(ApiService);

  deudores(): Observable<CuentaCredito[]> {
    return this.api.get<CuentaCredito[]>('/creditos/deudores');
  }

  estadoCuenta(idCliente: number): Observable<CuentaCredito[]> {
    return this.api.get<CuentaCredito[]>(`/creditos/cliente/${idCliente}`);
  }

  abrir(idCliente: number): Observable<CuentaCredito> {
    return this.api.post<CuentaCredito>(`/creditos/abrir/${idCliente}`, {});
  }
}
