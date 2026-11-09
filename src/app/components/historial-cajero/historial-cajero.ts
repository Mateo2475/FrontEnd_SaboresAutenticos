import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AbonoService } from '../../servicios/abono.service';
import { AuthService } from '../../service/auth.service';
import { NotificacionService } from '../../service/notificacion.service';
import { mensajeError } from '../../service/error.util';

@Component({
  selector: 'app-historial-cajero',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-header"><h1>Historial por cajero</h1></div>
    <section class="card">
      <div class="form-grid">
        <div class="field">
          <label>ID empleado</label>
          <input type="number" [(ngModel)]="idEmpleado" name="idEmpleado" />
        </div>
      </div>
      <button class="btn btn-primary btn-sm" type="button" (click)="cargar()">Consultar</button>
      <button class="btn btn-outline btn-sm" type="button" (click)="descargarPdf()">Descargar PDF</button>
    </section>
    @if (registros().length > 0) {
      <section class="card">
        <div class="table-wrap">
          <table class="table">
            <thead><tr><th>Fecha</th><th>Tipo</th><th>Método</th><th class="right">Monto</th></tr></thead>
            <tbody>
              @for (r of registros(); track $index) {
                <tr>
                  <td>{{ r.fechaOperacion | date: 'dd/MM/yyyy HH:mm' }}</td>
                  <td>{{ r.tipoOperacion }}</td>
                  <td>{{ r.metodoPago }}</td>
                  <td class="right">S/ {{ r.monto | number: '1.2-2' }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </section>
    }
  `,
})
export class HistorialCajero implements OnInit {
  private readonly abonoService = inject(AbonoService);
  private readonly authService = inject(AuthService);
  private readonly notificacionService = inject(NotificacionService);

  idEmpleado: number | null = this.authService.idEmpleado();
  readonly registros = signal<any[]>([]);

  ngOnInit(): void {
    if (this.idEmpleado) this.cargar();
  }

  cargar(): void {
    if (this.idEmpleado === null) return;
    this.abonoService.historialCajero(this.idEmpleado).subscribe({
      next: (rows) => this.registros.set(rows as any[]),
      error: (e: unknown) => this.notificacionService.error(mensajeError(e)),
    });
  }

  descargarPdf(): void {
    if (this.idEmpleado === null) return;
    this.abonoService.descargarHistorialCajero(this.idEmpleado).subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `historial_cajero_${this.idEmpleado}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
      },
      error: (e: unknown) => this.notificacionService.error(mensajeError(e)),
    });
  }
}
