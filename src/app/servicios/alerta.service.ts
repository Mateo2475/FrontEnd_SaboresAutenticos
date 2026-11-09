import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../service/api.service';
import { AlertaDeuda, EnvioAlerta } from '../models/reporte.models';

@Injectable({ providedIn: 'root' })
export class AlertaService {
  private readonly api = inject(ApiService);

  previsualizar(): Observable<AlertaDeuda[]> {
    return this.api.get<AlertaDeuda[]>('/alertas/deudas');
  }

  enviar(): Observable<EnvioAlerta[]> {
    return this.api.post<EnvioAlerta[]>('/alertas/deudas/enviar', {});
  }
}
