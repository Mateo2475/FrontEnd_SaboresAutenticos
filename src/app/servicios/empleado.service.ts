import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../service/api.service';
import { Empleado, EmpleadoRequest } from '../models/empleado.models';
import { MensajeResponse } from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class EmpleadoService {
  private readonly api = inject(ApiService);

  listar(): Observable<Empleado[]> {
    return this.api.get<Empleado[]>('/empleados');
  }

  obtener(id: number): Observable<Empleado> {
    return this.api.get<Empleado>(`/empleados/${id}`);
  }

  crear(empleado: EmpleadoRequest): Observable<Empleado> {
    return this.api.post<Empleado>('/empleados', empleado);
  }

  actualizar(id: number, empleado: EmpleadoRequest): Observable<Empleado> {
    return this.api.put<Empleado>(`/empleados/${id}`, empleado);
  }

  eliminar(id: number): Observable<MensajeResponse> {
    return this.api.delete<MensajeResponse>(`/empleados/${id}`);
  }
}
