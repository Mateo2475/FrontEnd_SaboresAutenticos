import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../service/api.service';
import { Categoria, CategoriaRequest } from '../models/categoria.models';
import { MensajeResponse } from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class CategoriaService {
  private readonly api = inject(ApiService);

  listar(): Observable<Categoria[]> {
    return this.api.get<Categoria[]>('/categorias');
  }

  raices(): Observable<Categoria[]> {
    return this.api.get<Categoria[]>('/categorias/raices');
  }

  subcategorias(id: number): Observable<Categoria[]> {
    return this.api.get<Categoria[]>(`/categorias/${id}/subcategorias`);
  }

  crear(categoria: CategoriaRequest): Observable<Categoria> {
    return this.api.post<Categoria>('/categorias', categoria);
  }

  actualizar(id: number, categoria: CategoriaRequest): Observable<Categoria> {
    return this.api.put<Categoria>(`/categorias/${id}`, categoria);
  }

  eliminar(id: number): Observable<MensajeResponse> {
    return this.api.delete<MensajeResponse>(`/categorias/${id}`);
  }
}
