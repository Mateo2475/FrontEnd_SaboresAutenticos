import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ParametroService, ParametroSistema } from '../../servicios/parametro.service';
import { NotificacionService } from '../../service/notificacion.service';
import { mensajeError } from '../../service/error.util';

@Component({
  selector: 'app-parametros',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-header"><h1>Parámetros del sistema</h1></div>
    <section class="card">
      @for (p of parametros(); track p.clave) {
        <div class="field">
          <label>{{ p.clave }} — {{ p.descripcion }}</label>
          <input [(ngModel)]="valores[p.clave]" name="{{ p.clave }}" />
          <button class="btn btn-primary btn-sm" type="button" (click)="guardar(p.clave)">Guardar</button>
        </div>
      }
      @if (parametros().length === 0) { <p class="muted">Sin parámetros.</p> }
    </section>
  `,
})
export class Parametros implements OnInit {
  private readonly service = inject(ParametroService);
  private readonly notificacionService = inject(NotificacionService);

  readonly parametros = signal<ParametroSistema[]>([]);
  valores: Record<string, string> = {};

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.service.listar().subscribe({
      next: (params) => {
        this.parametros.set(params);
        for (const p of params) this.valores[p.clave] = p.valor;
      },
      error: (e: unknown) => this.notificacionService.error(mensajeError(e)),
    });
  }

  guardar(clave: string): void {
    this.service.actualizar(clave, this.valores[clave]).subscribe({
      next: () => this.notificacionService.exito('Parámetro actualizado.'),
      error: (e: unknown) => this.notificacionService.error(mensajeError(e)),
    });
  }
}
