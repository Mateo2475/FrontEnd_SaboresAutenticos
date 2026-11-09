import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DashboardService } from '../../servicios/dashboard.service';
import { DashboardResumen } from '../../models/reporte.models';
import { NotificacionService } from '../../service/notificacion.service';
import { mensajeError } from '../../service/error.util';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})

export class Dashboard implements OnInit {
  private readonly dashboardService = inject(DashboardService);
  private readonly notificacionService = inject(NotificacionService);

  readonly resumen = signal<DashboardResumen | null>(null);
  readonly cargando = signal(true);

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando.set(true);
    this.dashboardService.resumen().subscribe({
      next: (resumen) => {
        this.resumen.set(resumen);
        this.cargando.set(false);
      },
      error: (error: unknown) => {
        this.cargando.set(false);
        this.notificacionService.error(mensajeError(error));
      },
    });
  }
}
