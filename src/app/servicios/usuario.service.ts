import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../service/api.service';
import { Usuario } from '../models/usuario.models';
import { MensajeResponse } from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private readonly api = inject(ApiService);

  listar(): Observable<Usuario[]> {
    return this.api.get<Usuario[]>('/usuarios');
  }

  cambiarEstado(username: string, enabled: boolean): Observable<MensajeResponse> {
    return this.api.put<MensajeResponse>(`/usuarios/${username}/enabled`, { enabled });
  }

  desbloquear(username: string): Observable<MensajeResponse> {
    return this.api.put<MensajeResponse>(`/usuarios/${username}/desbloquear`, {});
  }
}
