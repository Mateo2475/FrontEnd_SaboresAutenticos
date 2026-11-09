import { Injectable, signal } from '@angular/core';

export type TipoNotificacion = 'exito' | 'error' | 'info';

export interface Notificacion {
  id: number;
  tipo: TipoNotificacion;
  mensaje: string;
}

@Injectable({ providedIn: 'root' })
export class NotificacionService {
  private contador = 0;
  private readonly _notificaciones = signal<Notificacion[]>([]);
  readonly notificaciones = this._notificaciones.asReadonly();

  exito(mensaje: string): void {
    this.agregar('exito', mensaje);
  }

  error(mensaje: string): void {
    this.agregar('error', mensaje);
  }

  info(mensaje: string): void {
    this.agregar('info', mensaje);
  }

  cerrar(id: number): void {
    this._notificaciones.update((lista) => lista.filter((n) => n.id !== id));
  }

  private agregar(tipo: TipoNotificacion, mensaje: string): void {
    const id = ++this.contador;
    this._notificaciones.update((lista) => [...lista, { id, tipo, mensaje }]);
    setTimeout(() => this.cerrar(id), 4000);
  }
}
