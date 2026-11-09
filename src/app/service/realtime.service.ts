import { Injectable, OnDestroy, inject, signal } from '@angular/core';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { NotificacionService } from './notificacion.service';

@Injectable({ providedIn: 'root' })
export class RealtimeService implements OnDestroy {
  private readonly notificacionService = inject(NotificacionService);
  private client: Client | null = null;

  readonly conectado = signal(false);
  readonly ultimoMensaje = signal<string | null>(null);

  conectar(): void {
    if (this.client?.active) {
      return;
    }
    this.client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      reconnectDelay: 5000,
      onConnect: () => {
        this.conectado.set(true);
        this.client?.subscribe('/topic/ventas', (msg: IMessage) => this.recibir(msg));
        this.client?.subscribe('/topic/inventario', (msg: IMessage) => this.recibir(msg));
        this.client?.subscribe('/topic/alertas', (msg: IMessage) => this.recibir(msg));
      },
      onDisconnect: () => this.conectado.set(false),
      onStompError: (frame) => this.notificacionService.error(frame.headers['message'] ?? 'Error STOMP'),
    });
    this.client.activate();
  }

  private recibir(msg: IMessage): void {
    this.ultimoMensaje.set(msg.body);
    this.notificacionService.exito('Actualización en tiempo real recibida.');
  }

  desconectar(): void {
    void this.client?.deactivate();
    this.client = null;
    this.conectado.set(false);
  }

  ngOnDestroy(): void {
    this.desconectar();
  }
}
