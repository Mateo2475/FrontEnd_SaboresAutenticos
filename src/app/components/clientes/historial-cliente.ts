import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VentaService } from '../../servicios/venta.service';
import { NotificacionService } from '../../service/notificacion.service';
import { mensajeError } from '../../service/error.util';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-historial-cliente',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-header"><h1>Historial de consumo · Cliente #{{ id() }}</h1></div>
    @if (cargando()) {
      <div class="skeleton" style="width:100%;height:40px;"></div>
    } @else {
      @if (ventas().length === 0) {
        <p class="muted">Sin consumos registrados.</p>
      } @else {
        <button class="btn btn-outline btn-sm no-print" type="button" (click)="exportarExcel()">Exportar Excel (CSV)</button>
        @for (v of ventas(); track v.idVenta) {
          <section class="card">
            <p><strong>Venta #{{ v.idVenta }}</strong> · {{ v.fechaHora | date: 'dd/MM/yyyy HH:mm' }} · Total S/ {{ v.total | number: '1.2-2' }}</p>
            <div class="table-wrap">
              <table class="table">
                <thead><tr><th>Producto</th><th class="right">Cant.</th><th class="right">Subtotal</th></tr></thead>
                <tbody>
                  @for (d of v.detalles; track d.idProducto) {
                    <tr>
                      <td>{{ d.producto }}</td>
                      <td class="right">{{ d.cantidad }}</td>
                      <td class="right">S/ {{ d.subtotal | number: '1.2-2' }}</td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </section>
        }
        <div class="toolbar">
          <button class="btn btn-outline btn-sm" type="button" (click)="anterior()" [disabled]="paginaActual() === 0">Anterior</button>
          <span class="muted">Página {{ paginaActual() + 1 }} de {{ totalPaginas() }}</span>
          <button class="btn btn-outline btn-sm" type="button" (click)="siguiente()" [disabled]="paginaActual() + 1 >= totalPaginas()">Siguiente</button>
        </div>
      }
    }
  `,
})
export class HistorialCliente implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly ventaService = inject(VentaService);
  private readonly notificacionService = inject(NotificacionService);

  readonly id = signal<number | null>(null);
  readonly ventas = signal<any[]>([]);
  readonly cargando = signal(false);
  readonly paginaActual = signal(0);
  readonly totalPaginas = signal(1);

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('idCliente') ?? this.route.snapshot.paramMap.get('id');
    const id = idParam ? Number(idParam) : NaN;
    if (Number.isNaN(id)) return;
    this.id.set(id);
    this.cargarPagina(id, 0);
  }

  cargarPagina(id: number, page: number): void {
    this.cargando.set(true);
    this.ventaService.listarPorCliente(id, page, 20).pipe(finalize(() => this.cargando.set(false))).subscribe({
      next: (respuesta: any) => {
        this.ventas.set(respuesta?.content ?? []);
        this.paginaActual.set(respuesta?.number ?? page);
        this.totalPaginas.set(respuesta?.totalPages ?? 1);
      },
      error: (error: unknown) => this.notificacionService.error(mensajeError(error)),
    });
  }

  anterior(): void {
    const id = this.id();
    if (id !== null && this.paginaActual() > 0) this.cargarPagina(id, this.paginaActual() - 1);
  }
  siguiente(): void {
    const id = this.id();
    if (id !== null && this.paginaActual() + 1 < this.totalPaginas()) this.cargarPagina(id, this.paginaActual() + 1);
  }

  exportarExcel(): void {
    const filas = ['Venta,Fecha,Producto,Cantidad,Subtotal'];
    for (const v of this.ventas()) {
      for (const d of v.detalles ?? []) {
        filas.push(`${v.idVenta},${v.fechaHora},${d.producto},${d.cantidad},${d.subtotal}`);
      }
    }
    const blob = new Blob([filas.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `historial_cliente_${this.id()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }
}
