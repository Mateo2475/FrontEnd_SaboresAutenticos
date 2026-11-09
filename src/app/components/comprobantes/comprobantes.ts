import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComprobanteService } from '../../servicios/comprobante.service';
import { Comprobante } from '../../models/comprobante.models';
import { NotificacionService } from '../../service/notificacion.service';
import { mensajeError } from '../../service/error.util';

@Component({
  selector: 'app-comprobantes',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './comprobantes.html',
  styleUrl: './comprobantes.css'
})

export class Comprobantes implements OnInit {
  private readonly comprobanteService = inject(ComprobanteService);
  private readonly notificacionService = inject(NotificacionService);

  readonly comprobantes = signal<Comprobante[]>([]);

  desde = this.fechaISO(-30);
  hasta = this.fechaISO(0);

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.comprobanteService.listar(this.desde, this.hasta).subscribe({
      next: (comprobantes) => this.comprobantes.set(comprobantes),
      error: (error: unknown) => this.notificacionService.error(mensajeError(error)),
    });
  }

  descargar(id: number): void {
    this.comprobanteService.descargarPdf(id).subscribe({
      next: (blob) => this.descargarBlob(blob, `comprobante_${id}.pdf`),
      error: (error: unknown) => this.notificacionService.error(mensajeError(error)),
    });
  }

  reimprimir(id: number): void {
    this.comprobanteService.reimprimir(id).subscribe({
      next: (blob) => this.descargarBlob(blob, `comprobante_${id}_reimpresion.pdf`),
      error: (error: unknown) => this.notificacionService.error(mensajeError(error)),
    });
  }

  private descargarBlob(blob: Blob, nombre: string): void {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = nombre;
    a.click();
    URL.revokeObjectURL(url);
  }

  private fechaISO(dias: number): string {
    const fecha = new Date();
    fecha.setDate(fecha.getDate() + dias);
    return fecha.toISOString().slice(0, 10);
  }
}
