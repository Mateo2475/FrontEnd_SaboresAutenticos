import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../service/api.service';
import { GuiaRemision, GuiaRequest } from '../models/guia.models';

@Injectable({ providedIn: 'root' })
export class GuiaService {
  private readonly api = inject(ApiService);

  listar(): Observable<GuiaRemision[]> {
    return this.api.get<GuiaRemision[]>('/guias');
  }

  obtener(id: number): Observable<GuiaRemision> {
    return this.api.get<GuiaRemision>(`/guias/${id}`);
  }

  registrar(request: GuiaRequest): Observable<GuiaRemision> {
    return this.api.post<GuiaRemision>('/guias', request);
  }
}
