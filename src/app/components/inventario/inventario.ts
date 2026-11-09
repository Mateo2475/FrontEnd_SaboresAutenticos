import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductoService } from '../../servicios/producto.service';
import { AlertaInventario, RankingProducto } from '../../models/producto.models';
import { NotificacionService } from '../../service/notificacion.service';
import { mensajeError } from '../../service/error.util';

@Component({
  selector: 'app-inventario',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './inventario.html',
  styleUrl: './inventario.css'
})

export class Inventario implements OnInit {
  private readonly productoService = inject(ProductoService);
  private readonly notificacionService = inject(NotificacionService);

  readonly alertas = signal<AlertaInventario[]>([]);
  readonly ranking = signal<RankingProducto[]>([]);

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.productoService.alertas().subscribe({
      next: (alertas) => this.alertas.set(alertas),
      error: (error: unknown) => this.notificacionService.error(mensajeError(error)),
    });
    this.productoService.ranking().subscribe({
      next: (ranking) => this.ranking.set(ranking),
      error: (error: unknown) => this.notificacionService.error(mensajeError(error)),
    });
  }
}
