import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../service/api.service';
import { Cliente, ClienteRequest } from '../models/cliente.models';
import { MensajeResponse } from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class ClienteService {
  private readonly api = inject(ApiService);

  listar(): Observable<Cliente[]> {
    return this.api.get<Cliente[]>('/clientes');
  }

  obtener(id: number): Observable<Cliente> {
    return this.api.get<Cliente>(`/clientes/${id}`);
  }

  buscar(filtro: string): Observable<Cliente[]> {
    return this.api.get<Cliente[]>('/clientes/buscar', { filtro });
  }

  crear(cliente: ClienteRequest): Observable<Cliente> {
    return this.api.post<Cliente>('/clientes', cliente);
  }

  actualizar(id: number, cliente: ClienteRequest): Observable<Cliente> {
    return this.api.put<Cliente>(`/clientes/${id}`, cliente);
  }

  desactivar(id: number): Observable<MensajeResponse> {
    return this.api.delete<MensajeResponse>(`/clientes/${id}`);
  }

  activar(id: number): Observable<MensajeResponse> {
    return this.api.put<MensajeResponse>(`/clientes/${id}/activar`, {});
  }
}
