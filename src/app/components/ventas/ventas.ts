import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VentaService } from '../../servicios/venta.service';
import { AuthService } from '../../service/auth.service';
import { NotificacionService } from '../../service/notificacion.service';
import { mensajeError } from '../../service/error.util';
import { MfaSolicitudResponse, Venta } from '../../models/venta.models';

@Component({
  selector: 'app-ventas',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './ventas.html',
  styleUrl: './ventas.css'
})

export class Ventas implements OnInit {
  readonly authService = inject(AuthService);
  private readonly ventaService = inject(VentaService);
  private readonly notificacionService = inject(NotificacionService);

  readonly ventas = signal<Venta[]>([]);
  readonly filtro = signal('TODAS');
  readonly detalle = signal<Venta | null>(null);
  readonly ventaAnular = signal<Venta | null>(null);
  readonly mfa = signal<MfaSolicitudResponse | null>(null);
  readonly solicitandoMfa = signal(false);
  readonly anulando = signal(false);

  motivo = '';
  codigo = '';

  readonly ventasFiltradas = computed(() => {
    const filtro = this.filtro();
    if (filtro === 'TODAS') {
      return this.ventas();
    }
    return this.ventas().filter((venta) => venta.estado === filtro);
  });

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.ventaService.listar().subscribe({
      next: (ventas) => this.ventas.set(ventas),
      error: (error: unknown) => this.notificacionService.error(mensajeError(error)),
    });
  }

  verDetalle(venta: Venta): void {
    this.detalle.set(venta);
  }

  abrirAnulacion(venta: Venta): void {
    this.ventaAnular.set(venta);
    this.motivo = '';
    this.codigo = '';
    this.mfa.set(null);
  }

  cerrarAnulacion(): void {
    this.ventaAnular.set(null);
    this.mfa.set(null);
  }

  solicitarMfa(): void {
    this.solicitandoMfa.set(true);
    this.ventaService.solicitarMfa().subscribe({
      next: (respuesta) => {
        this.solicitandoMfa.set(false);
        this.mfa.set(respuesta);
        this.codigo = respuesta.codigo;
        this.notificacionService.info('Código MFA generado (simulación).');
      },
      error: (error: unknown) => {
        this.solicitandoMfa.set(false);
        this.notificacionService.error(mensajeError(error));
      },
    });
  }

  anular(): void {
    const venta = this.ventaAnular();
    if (!venta) {
      return;
    }
    if (this.motivo.trim().length < 15) {
      this.notificacionService.error('El motivo de anulación debe tener al menos 15 caracteres.');
      return;
    }
    if (this.codigo.trim().length === 0) {
      this.notificacionService.error('Ingrese el código MFA.');
      return;
    }

    this.anulando.set(true);
    this.ventaService.anular(venta.idVenta, { motivo: this.motivo.trim(), codigoMfa: this.codigo.trim() }).subscribe({
      next: (ventaAnulada) => {
        this.anulando.set(false);
        this.notificacionService.exito('Venta anulada correctamente.');
        this.cerrarAnulacion();
        this.ventas.update((lista) => lista.map((v) => (v.idVenta === ventaAnulada.idVenta ? ventaAnulada : v)));
      },
      error: (error: unknown) => {
        this.anulando.set(false);
        this.notificacionService.error(mensajeError(error));
      },
    });
  }
}
