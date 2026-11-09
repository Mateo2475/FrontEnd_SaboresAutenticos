import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GuiaService } from '../../servicios/guia.service';
import { ProductoService } from '../../servicios/producto.service';
import { GuiaRemision } from '../../models/guia.models';
import { Producto } from '../../models/producto.models';
import { NotificacionService } from '../../service/notificacion.service';
import { mensajeError } from '../../service/error.util';

interface LineaGuia {
  idProducto: number | null;
  cantidad: number;
}

@Component({
  selector: 'app-guias',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './guias.html',
  styleUrl: './guias.css'
})

export class Guias implements OnInit {
  private readonly guiaService = inject(GuiaService);
  private readonly productoService = inject(ProductoService);
  private readonly notificacionService = inject(NotificacionService);

  readonly guias = signal<GuiaRemision[]>([]);
  readonly productos = signal<Producto[]>([]);
  readonly lineas = signal<LineaGuia[]>([{ idProducto: null, cantidad: 1 }]);
  readonly registrando = signal(false);

  numeroGuia = '';
  proveedor = '';

  ngOnInit(): void {
    this.cargar();
    this.productoService.listar().subscribe({
      next: (productos) => this.productos.set(productos),
      error: (error: unknown) => this.notificacionService.error(mensajeError(error)),
    });
  }

  cargar(): void {
    this.guiaService.listar().subscribe({
      next: (guias) => this.guias.set(guias),
      error: (error: unknown) => this.notificacionService.error(mensajeError(error)),
    });
  }

  agregarLinea(): void {
    this.lineas.update((lineas) => [...lineas, { idProducto: null, cantidad: 1 }]);
  }

  quitarLinea(indice: number): void {
    this.lineas.update((lineas) => lineas.filter((_, i) => i !== indice));
  }

  actualizarProducto(indice: number, idProducto: number | null): void {
    this.lineas.update((lineas) => lineas.map((linea, i) => (i === indice ? { ...linea, idProducto } : linea)));
  }

  actualizarCantidad(indice: number, cantidad: number): void {
    this.lineas.update((lineas) =>
      lineas.map((linea, i) => (i === indice ? { ...linea, cantidad: Number(cantidad) } : linea)),
    );
  }

  totalUnidades(guia: GuiaRemision): number {
    return guia.detalles.reduce((total, detalle) => total + detalle.cantidad, 0);
  }

  registrar(): void {
    if (this.numeroGuia.trim().length === 0 || this.proveedor.trim().length === 0) {
      this.notificacionService.error('Ingrese el número de guía y el proveedor.');
      return;
    }
    const detalles = this.lineas()
      .filter((linea) => linea.idProducto !== null && linea.cantidad > 0)
      .map((linea) => ({ idProducto: Number(linea.idProducto), cantidad: linea.cantidad }));

    if (detalles.length === 0) {
      this.notificacionService.error('Agregue al menos un producto.');
      return;
    }

    this.registrando.set(true);
    this.guiaService
      .registrar({ numeroGuia: this.numeroGuia.trim(), proveedor: this.proveedor.trim(), detalles })
      .subscribe({
        next: () => {
          this.registrando.set(false);
          this.notificacionService.exito('Guía registrada y stock actualizado.');
          this.numeroGuia = '';
          this.proveedor = '';
          this.lineas.set([{ idProducto: null, cantidad: 1 }]);
          this.cargar();
          this.productoService.listar().subscribe({ next: (productos) => this.productos.set(productos) });
        },
        error: (error: unknown) => {
          this.registrando.set(false);
          this.notificacionService.error(mensajeError(error));
        },
      });
  }
}
