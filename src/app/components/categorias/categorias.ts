import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CategoriaService } from '../../servicios/categoria.service';
import { Categoria, CategoriaRequest } from '../../models/categoria.models';
import { NotificacionService } from '../../service/notificacion.service';
import { mensajeError } from '../../service/error.util';

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './categorias.html',
  styleUrl: './categorias.css'
})

export class Categorias implements OnInit {
  private readonly categoriaService = inject(CategoriaService);
  private readonly notificacionService = inject(NotificacionService);
  private readonly fb = inject(FormBuilder);

  readonly categorias = signal<Categoria[]>([]);
  readonly raices = signal<Categoria[]>([]);
  readonly modalAbierto = signal(false);
  readonly editando = signal<Categoria | null>(null);
  readonly guardando = signal(false);

  readonly raicesDisponibles = computed(() => {
    const actual = this.editando();
    return this.raices().filter((raiz) => raiz.idCategoria !== actual?.idCategoria);
  });

  readonly form = this.fb.group({
    nombre: ['', Validators.required],
    idCategoriaPadre: [null as number | null],
    descripcion: [''],
  });

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.categoriaService.listar().subscribe({
      next: (categorias) => this.categorias.set(categorias),
      error: (error: unknown) => this.notificacionService.error(mensajeError(error)),
    });
    this.categoriaService.raices().subscribe({
      next: (raices) => this.raices.set(raices),
      error: (error: unknown) => this.notificacionService.error(mensajeError(error)),
    });
  }

  padreNombre(categoria: Categoria): string {
    if (!categoria.idCategoriaPadre) {
      return '—';
    }
    return this.categorias().find((c) => c.idCategoria === categoria.idCategoriaPadre)?.nombre ?? '—';
  }

  abrirCrear(): void {
    this.editando.set(null);
    this.form.reset({ nombre: '', idCategoriaPadre: null, descripcion: '' });
    this.modalAbierto.set(true);
  }

  abrirEditar(categoria: Categoria): void {
    this.editando.set(categoria);
    this.form.reset({
      nombre: categoria.nombre,
      idCategoriaPadre: categoria.idCategoriaPadre ?? null,
      descripcion: categoria.descripcion ?? '',
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
    const request: CategoriaRequest = {
      nombre: valores.nombre ?? '',
      idCategoriaPadre: valores.idCategoriaPadre,
      descripcion: valores.descripcion ?? '',
    };
    const actual = this.editando();
    const peticion = actual
      ? this.categoriaService.actualizar(actual.idCategoria, request)
      : this.categoriaService.crear(request);

    peticion.subscribe({
      next: () => {
        this.guardando.set(false);
        this.modalAbierto.set(false);
        this.notificacionService.exito(actual ? 'Categoría actualizada.' : 'Categoría registrada.');
        this.cargar();
      },
      error: (error: unknown) => {
        this.guardando.set(false);
        this.notificacionService.error(mensajeError(error));
      },
    });
  }

  eliminar(categoria: Categoria): void {
    if (!confirm(`¿Eliminar la categoría ${categoria.nombre}?`)) {
      return;
    }
    this.categoriaService.eliminar(categoria.idCategoria).subscribe({
      next: () => {
        this.notificacionService.exito('Categoría eliminada.');
        this.cargar();
      },
      error: (error: unknown) => this.notificacionService.error(mensajeError(error)),
    });
  }
}
