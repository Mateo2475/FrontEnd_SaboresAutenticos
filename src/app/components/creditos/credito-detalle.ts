import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CreditoService } from '../../servicios/credito.service';
import { CuentaCredito } from '../../models/credito.models';
import { NotificacionService } from '../../service/notificacion.service';
import { mensajeError } from '../../service/error.util';

@Component({
  selector: 'app-credito-detalle',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-header">
      <h1>Créditos del cliente #{{ id() }}</h1>
    </div>
    @if (cargando()) {
      <p class="muted">Cargando...</p>
    } @else {
      @for (c of creditos(); track c.idCliente + '-' + c.year + '-' + c.month) {
        <div class="card">Deuda: S/ {{ c.deudaPendiente | number: '1.2-2' }} · Disponible: S/ {{ c.saldoDisponible | number: '1.2-2' }}</div>
      }
    }
  `,
})
export class CreditoDetalle implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly creditoService = inject(CreditoService);
  private readonly notificacionService = inject(NotificacionService);

  readonly id = signal<number | null>(null);
  readonly creditos = signal<CuentaCredito[]>([]);
  readonly cargando = signal(false);

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('idCliente');
    const id = idParam ? Number(idParam) : NaN;
    if (Number.isNaN(id)) {
      return;
    }
    this.id.set(id);
    this.cargando.set(true);
    this.creditoService.estadoCuenta(id).subscribe({
      next: (creditos) => {
        this.creditos.set(creditos);
        this.cargando.set(false);
      },
      error: (error: unknown) => {
        this.cargando.set(false);
        this.notificacionService.error(mensajeError(error));
      },
    });
  }
}
