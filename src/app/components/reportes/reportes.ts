import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReporteService } from '../../servicios/reporte.service';
import { CuentaCredito } from '../../models/credito.models';
import { RankingProducto } from '../../models/producto.models';
import { VentasReporte } from '../../models/reporte.models';
import { NotificacionService } from '../../service/notificacion.service';
import { mensajeError } from '../../service/error.util';


type TabReporte = 'ventas' | 'creditos' | 'productos';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './reportes.html',
  styleUrl: './reportes.css'
})

export class Reportes implements OnInit {
  private readonly reporteService = inject(ReporteService);
  private readonly notificacionService = inject(NotificacionService);

  readonly tab = signal<TabReporte>('ventas');
  readonly reporteVentas = signal<VentasReporte | null>(null);
  readonly creditos = signal<CuentaCredito[]>([]);
  readonly productos = signal<RankingProducto[]>([]);

  desde = this.fechaISO(-30);
  hasta = this.fechaISO(0);

  ngOnInit(): void {
    this.cargarVentas();
  }

  cambiarTab(tab: TabReporte): void {
    this.tab.set(tab);
    if (tab === 'ventas') {
      this.cargarVentas();
    } else if (tab === 'creditos') {
      this.cargarCreditos();
    } else {
      this.cargarProductos();
    }
  }

  cargarVentas(): void {
    this.reporteService.ventas(this.desde, this.hasta).subscribe({
      next: (reporte) => this.reporteVentas.set(reporte),
      error: (error: unknown) => this.notificacionService.error(mensajeError(error)),
    });
  }

  cargarCreditos(): void {
    this.reporteService.creditos().subscribe({
      next: (creditos) => this.creditos.set(creditos),
      error: (error: unknown) => this.notificacionService.error(mensajeError(error)),
    });
  }

  cargarProductos(): void {
    this.reporteService.productos().subscribe({
      next: (productos) => this.productos.set(productos),
      error: (error: unknown) => this.notificacionService.error(mensajeError(error)),
    });
  }

  descargarVentas(formato: 'excel' | 'pdf'): void {
    this.reporteService.descargarVentas(this.desde, this.hasta, formato).subscribe({
      next: (blob) => this.guardarArchivo(blob, `ventas.${formato === 'excel' ? 'xlsx' : 'pdf'}`),
      error: (error: unknown) => this.notificacionService.error(mensajeError(error)),
    });
  }

  descargarCreditos(formato: 'excel' | 'pdf'): void {
    this.reporteService.descargarCreditos(formato).subscribe({
      next: (blob) => this.guardarArchivo(blob, `creditos.${formato === 'excel' ? 'xlsx' : 'pdf'}`),
      error: (error: unknown) => this.notificacionService.error(mensajeError(error)),
    });
  }

  descargarProductos(formato: 'excel' | 'pdf'): void {
    this.reporteService.descargarProductos(formato).subscribe({
      next: (blob) => this.guardarArchivo(blob, `productos.${formato === 'excel' ? 'xlsx' : 'pdf'}`),
      error: (error: unknown) => this.notificacionService.error(mensajeError(error)),
    });
  }

  private guardarArchivo(blob: Blob, nombre: string): void {
    const url = URL.createObjectURL(blob);
    const enlace = document.createElement('a');
    enlace.href = url;
    enlace.download = nombre;
    enlace.click();
    URL.revokeObjectURL(url);
  }

  private fechaISO(dias: number): string {
    const fecha = new Date();
    fecha.setDate(fecha.getDate() + dias);
    return fecha.toISOString().slice(0, 10);
  }
}
