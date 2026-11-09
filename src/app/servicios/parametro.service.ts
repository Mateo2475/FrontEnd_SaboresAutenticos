import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../service/api.service';

export interface ParametroSistema {
  clave: string;
  valor: string;
  descripcion?: string;
}

@Injectable({ providedIn: 'root' })
export class ParametroService {
  private readonly api = inject(ApiService);

  listar(): Observable<ParametroSistema[]> {
    return this.api.get<ParametroSistema[]>('/parametros');
  }

  actualizar(clave: string, valor: string): Observable<ParametroSistema> {
    return this.api.put<ParametroSistema>(`/parametros?clave=${encodeURIComponent(clave)}&valor=${encodeURIComponent(valor)}`, {});
  }
}
