import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../service/api.service';
import { DashboardResumen } from '../models/reporte.models';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly api = inject(ApiService);

  resumen(): Observable<DashboardResumen> {
    return this.api.get<DashboardResumen>('/dashboard');
  }
}
