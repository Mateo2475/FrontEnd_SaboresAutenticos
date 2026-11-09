import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

export const API_BASE_URL = 'http://localhost:8080/api';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);

  get<T>(path: string, params?: Record<string, string | number | boolean | null | undefined>): Observable<T> {
    return this.http.get<T>(`${API_BASE_URL}${path}`, { params: this.construirParams(params) });
  }

  post<T>(path: string, body: unknown): Observable<T> {
    return this.http.post<T>(`${API_BASE_URL}${path}`, body);
  }

  put<T>(path: string, body: unknown): Observable<T> {
    return this.http.put<T>(`${API_BASE_URL}${path}`, body);
  }

  delete<T>(path: string): Observable<T> {
    return this.http.delete<T>(`${API_BASE_URL}${path}`);
  }

  descargar(path: string, params?: Record<string, string | number | boolean | null | undefined>): Observable<Blob> {
    return this.http.get(`${API_BASE_URL}${path}`, {
      params: this.construirParams(params),
      responseType: 'blob',
    });
  }

  private construirParams(params?: Record<string, string | number | boolean | null | undefined>): HttpParams {
    let httpParams = new HttpParams();
    if (!params) {
      return httpParams;
    }
    for (const [clave, valor] of Object.entries(params)) {
      if (valor !== null && valor !== undefined && valor !== '') {
        httpParams = httpParams.set(clave, String(valor));
      }
    }
    return httpParams;
  }
}
