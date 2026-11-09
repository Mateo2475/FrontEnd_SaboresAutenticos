import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EmpleadoService } from '../../servicios/empleado.service';
import { Empleado, EmpleadoRequest } from '../../models/empleado.models';
import { NotificacionService } from '../../service/notificacion.service';
import { mensajeError } from '../../service/error.util';

@Component({
  selector: 'app-empleados',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './empleados.html',
  styleUrl: './empleados.css'
})

export class Empleados implements OnInit {
  private readonly empleadoService = inject(EmpleadoService);
  private readonly notificacionService = inject(NotificacionService);
  private readonly fb = inject(FormBuilder);

  readonly empleados = signal<Empleado[]>([]);
  readonly modalAbierto = signal(false);
  readonly editando = signal<Empleado | null>(null);
  readonly guardando = signal(false);

  readonly form = this.fb.nonNullable.group({
    nombres: ['', Validators.required],
    apellidos: ['', Validators.required],
    dni: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
    correo: [''],
    telefono: [''],
  });

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.empleadoService.listar().subscribe({
      next: (empleados) => this.empleados.set(empleados),
      error: (error: unknown) => this.notificacionService.error(mensajeError(error)),
    });
  }

  abrirCrear(): void {
    this.editando.set(null);
    this.form.reset({ nombres: '', apellidos: '', dni: '', correo: '', telefono: '' });
    this.modalAbierto.set(true);
  }

  abrirEditar(empleado: Empleado): void {
    this.editando.set(empleado);
    this.form.reset({
      nombres: empleado.nombres,
      apellidos: empleado.apellidos,
      dni: empleado.dni,
      correo: empleado.correo ?? '',
      telefono: empleado.telefono ?? '',
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
    const request: EmpleadoRequest = this.form.getRawValue();
    const actual = this.editando();
    const peticion = actual
      ? this.empleadoService.actualizar(actual.idEmpleado, request)
      : this.empleadoService.crear(request);

    peticion.subscribe({
      next: () => {
        this.guardando.set(false);
        this.modalAbierto.set(false);
        this.notificacionService.exito(actual ? 'Empleado actualizado.' : 'Empleado registrado.');
        this.cargar();
      },
      error: (error: unknown) => {
        this.guardando.set(false);
        this.notificacionService.error(mensajeError(error));
      },
    });
  }

  eliminar(empleado: Empleado): void {
    if (!confirm(`¿Eliminar al empleado ${empleado.nombres} ${empleado.apellidos}?`)) {
      return;
    }
    this.empleadoService.eliminar(empleado.idEmpleado).subscribe({
      next: () => {
        this.notificacionService.exito('Empleado eliminado.');
        this.cargar();
      },
      error: (error: unknown) => this.notificacionService.error(mensajeError(error)),
    });
  }
}
