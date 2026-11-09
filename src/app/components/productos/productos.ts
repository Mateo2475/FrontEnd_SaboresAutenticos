import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductoService } from '../../servicios/producto.service';
import { CategoriaService } from '../../servicios/categoria.service';
import { Producto, ProductoRequest } from '../../models/producto.models';
import { Categoria } from '../../models/categoria.models';
import { NotificacionService } from '../../service/notificacion.service';
import { mensajeError } from '../../service/error.util';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './productos.html',
  styleUrl: './productos.css'
})

export class Productos implements OnInit {
  private readonly productoService = inject(ProductoService);
  private readonly categoriaService = inject(CategoriaService);
  private readonly notificacionService = inject(NotificacionService);
  private readonly fb = inject(FormBuilder);

  readonly productos = signal<Producto[]>([]);
  readonly categorias = signal<Categoria[]>([]);
  readonly filtro = signal('');
  readonly modalAbierto = signal(false);
  readonly editando = signal<Producto | null>(null);
  readonly guardando = signal(false);

  readonly form = this.fb.group({
    nombre: ['', Validators.required],
    idCategoria: [null as number | null, Validators.required],
    precio: [0, [Validators.required, Validators.min(0.01)]],
    stock: [0, [Validators.required, Validators.min(0)]],
    stockMinimo: [0, [Validators.required, Validators.min(0)]],
    fechaCaducidad: [''],
    activo: [true],
  });

  ngOnInit(): void {
    this.cargar();
    this.categoriaService.listar().subscribe({
      next: (categorias) => this.categorias.set(categorias),
      error: (error: unknown) => this.notificacionService.error(mensajeError(error)),
    });
  }

  cargar(): void {
    this.filtro.set('');
    this.productoService.listar().subscribe({
      next: (productos) => this.productos.set(productos),
      error: (error: unknown) => this.notificacionService.error(mensajeError(error)),
    });
  }

  cambiarFiltro(evento: Event): void {
    const valor = (evento.target as HTMLInputElement).value;
    this.filtro.set(valor);
    if (valor.trim().length === 0) {
      this.cargar();
      return;
    }
    this.productoService.buscar(valor.trim()).subscribe({
      next: (productos) => this.productos.set(productos),
      error: (error: unknown) => this.notificacionService.error(mensajeError(error)),
    });
  }

  abrirCrear(): void {
    this.editando.set(null);
    this.form.reset({
      nombre: '',
      idCategoria: null,
      precio: 0,
      stock: 0,
      stockMinimo: 0,
      fechaCaducidad: '',
      activo: true,
    });
    this.modalAbierto.set(true);
  }

  abrirEditar(producto: Producto): void {
    this.editando.set(producto);
    this.form.reset({
      nombre: producto.nombre,
      idCategoria: producto.idCategoria ?? null,
      precio: producto.precio,
      stock: producto.stock,
      stockMinimo: producto.stockMinimo,
      fechaCaducidad: producto.fechaCaducidad ?? '',
      activo: producto.activo,
    });
    this.modalAbierto.set(true);
  }

  cerrarModal(): void {
    this.modalAbierto.set(false);
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.guardando.set(true);
    const valores = this.form.getRawValue();
    const request: ProductoRequest = {
      nombre: valores.nombre ?? '',
      precio: Number(valores.precio ?? 0),
      stock: Number(valores.stock ?? 0),
      stockMinimo: Number(valores.stockMinimo ?? 0),
      activo: valores.activo ?? true,
      fechaCaducidad: valores.fechaCaducidad || undefined,
      categoria: { idCategoria: Number(valores.idCategoria ?? 0) },
    };
    const actual = this.editando();
    const peticion = actual
      ? this.productoService.actualizar(actual.idProducto, request)
      : this.productoService.crear(request);

    peticion.subscribe({
      next: () => {
        this.guardando.set(false);
        this.modalAbierto.set(false);
        this.notificacionService.exito(actual ? 'Producto actualizado.' : 'Producto registrado.');
        this.cargar();
      },
      error: (error: unknown) => {
        this.guardando.set(false);
        this.notificacionService.error(mensajeError(error));
      },
    });
  }

  desactivar(producto: Producto): void {
    if (!confirm(`¿Desactivar el producto ${producto.nombre}?`)) {
      return;
    }
    this.productoService.desactivar(producto.idProducto).subscribe({
      next: () => {
        this.notificacionService.exito('Producto desactivado.');
        this.cargar();
      },
      error: (error: unknown) => this.notificacionService.error(mensajeError(error)),
    });
  }
}
