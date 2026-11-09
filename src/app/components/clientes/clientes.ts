import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClienteService } from '../../servicios/cliente.service';
import { Cliente, ClienteRequest } from '../../models/cliente.models';
import { NotificacionService } from '../../service/notificacion.service';
import { mensajeError } from '../../service/error.util';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './clientes.html',
  styleUrl: './clientes.css'
})

export class Clientes implements OnInit {
  private readonly clienteService = inject(ClienteService);
  private readonly notificacionService = inject(NotificacionService);
  private readonly fb = inject(FormBuilder);

  readonly clientes = signal<Cliente[]>([]);
  readonly filtro = signal('');
  readonly modalAbierto = signal(false);
  readonly editando = signal<Cliente | null>(null);
  readonly guardando = signal(false);

  readonly form = this.fb.nonNullable.group({
    nombres: ['', Validators.required],
    apellidos: ['', Validators.required],
    dni: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
    correo: [''],
    telefono: [''],
    area: [''],
  });

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.filtro.set('');
    this.clienteService.listar().subscribe({
      next: (clientes) => this.clientes.set(clientes),
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
    this.clienteService.buscar(valor.trim()).subscribe({
      next: (clientes) => this.clientes.set(clientes),
      error: (error: unknown) => this.notificacionService.error(mensajeError(error)),
    });
  }

  abrirCrear(): void {
    this.editando.set(null);
    this.form.reset({ nombres: '', apellidos: '', dni: '', correo: '', telefono: '', area: '' });
    this.modalAbierto.set(true);
  }

  abrirEditar(cliente: Cliente): void {
    this.editando.set(cliente);
    this.form.reset({
      nombres: cliente.nombres,
      apellidos: cliente.apellidos,
      dni: cliente.dni,
      correo: cliente.correo ?? '',
      telefono: cliente.telefono ?? '',
      area: cliente.area ?? '',
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
    const request: ClienteRequest = this.form.getRawValue();
    const actual = this.editando();
    const peticion = actual
      ? this.clienteService.actualizar(actual.idCliente, request)
      : this.clienteService.crear(request);

    peticion.subscribe({
      next: () => {
        this.guardando.set(false);
        this.modalAbierto.set(false);
        this.notificacionService.exito(actual ? 'Cliente actualizado.' : 'Cliente registrado.');
        this.cargar();
      },
      error: (error: unknown) => {
        this.guardando.set(false);
        this.notificacionService.error(mensajeError(error));
      },
    });
  }

  activar(cliente: Cliente): void {
  if (!confirm(`¿Activar al cliente ${cliente.nombres} ${cliente.apellidos}?`)) {
    return;
  }
  this.clienteService.activar(cliente.idCliente).subscribe({
    next: () => {
      this.notificacionService.exito('Cliente activado.');
      this.cargar();
    },
    error: (error: unknown) => this.notificacionService.error(mensajeError(error)),
  });
}

  desactivar(cliente: Cliente): void {
    if (!confirm(`¿Desactivar al cliente ${cliente.nombres} ${cliente.apellidos}?`)) {
      return;
    }
    this.clienteService.desactivar(cliente.idCliente).subscribe({
      next: () => {
        this.notificacionService.exito('Cliente desactivado.');
        this.cargar();
      },
      error: (error: unknown) => this.notificacionService.error(mensajeError(error)),
    });
  }
}
