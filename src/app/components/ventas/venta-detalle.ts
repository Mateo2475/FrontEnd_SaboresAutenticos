import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { VentaService } from '../../servicios/venta.service';
import { Venta } from '../../models/venta.models';
import { NotificacionService } from '../../service/notificacion.service';
import { mensajeError } from '../../service/error.util';

@Component({
  selector: 'app-venta-detalle',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-header">
      <h1>Detalle de venta #{{ id() }}</h1>
    </div>
    @if (cargando()) {
      <p class="muted">Cargando...</p>
    } @else if (venta(); as v) {
      <div class="card">
        <p>Total: S/ {{ v.total | number: '1.2-2' }}</p>
        <p>Tipo de pago: {{ v.tipoPago }}</p>
      </div>
    }
  `,
})
export class VentaDetalle implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly ventaService = inject(VentaService);
  private readonly notificacionService = inject(NotificacionService);

  readonly id = signal<number | null>(null);
  readonly venta = signal<Venta | null>(null);
  readonly cargando = signal(false);

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? Number(idParam) : NaN;
    if (Number.isNaN(id)) {
      return;
    }
    this.id.set(id);
    this.cargando.set(true);
    this.ventaService.obtener(id).subscribe({
      next: (venta) => {
        this.venta.set(venta);
        this.cargando.set(false);
      },
      error: (error: unknown) => {
        this.cargando.set(false);
        this.notificacionService.error(mensajeError(error));
      },
    });
  }
}
