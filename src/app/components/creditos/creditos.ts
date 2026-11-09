import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CreditoService } from '../../servicios/credito.service';
import { AbonoService } from '../../servicios/abono.service';
import { AuthService } from '../../service/auth.service';
import { CuentaCredito } from '../../models/credito.models';
import { AbonoAplicado } from '../../models/abono.models';
import { NotificacionService } from '../../service/notificacion.service';
import { mensajeError } from '../../service/error.util';


@Component({
  selector: 'app-creditos',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './creditos.html',
  styleUrl: './creditos.css'
})

export class Creditos implements OnInit {
  private readonly creditoService = inject(CreditoService);
  private readonly abonoService = inject(AbonoService);
  private readonly notificacionService = inject(NotificacionService);
  readonly authService = inject(AuthService);
  readonly puedeEscribir = computed(() => this.authService.tieneRol('ADMIN', 'CAJERO'));

  readonly deudores = signal<CuentaCredito[]>([]);
  readonly estadoCuenta = signal<CuentaCredito[]>([]);
  readonly clienteActual = signal('');
  readonly cuentaAbono = signal<CuentaCredito | null>(null);
  readonly abonando = signal(false);
  readonly ultimoAbono = signal<AbonoAplicado | null>(null);

  monto = 0;
  metodoPago = 'EFECTIVO';
  idClienteAbrir: number | null = null;

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.creditoService.deudores().subscribe({
      next: (deudores) => this.deudores.set(deudores),
      error: (error: unknown) => this.notificacionService.error(mensajeError(error)),
    });
  }

  abrirCuenta(): void {
    if (this.idClienteAbrir === null) {
      this.notificacionService.error('Ingrese el ID del cliente.');
      return;
    }
    this.creditoService.abrir(this.idClienteAbrir).subscribe({
      next: () => {
        this.notificacionService.exito('Cuenta de crédito abierta.');
        this.idClienteAbrir = null;
        this.cargar();
      },
      error: (error: unknown) => this.notificacionService.error(mensajeError(error)),
    });
  }

  verEstado(cuenta: CuentaCredito): void {
    this.clienteActual.set(`${cuenta.nombres} ${cuenta.apellidos}`);
    this.creditoService.estadoCuenta(cuenta.idCliente).subscribe({
      next: (estado) => this.estadoCuenta.set(estado),
      error: (error: unknown) => this.notificacionService.error(mensajeError(error)),
    });
  }

  abrirAbono(cuenta: CuentaCredito): void {
    this.cuentaAbono.set(cuenta);
    this.monto = cuenta.deudaPendiente;
    this.metodoPago = 'EFECTIVO';
    this.ultimoAbono.set(null);
  }

  cerrarAbono(): void {
    this.cuentaAbono.set(null);
    this.ultimoAbono.set(null);
  }

  registrarAbono(): void {
    const cuenta = this.cuentaAbono();
    if (!cuenta) {
      return;
    }
    if (!this.monto || this.monto <= 0) {
      this.notificacionService.error('Ingrese un monto válido.');
      return;
    }

    this.abonando.set(true);
    this.abonoService.registrar({ idCliente: cuenta.idCliente, monto: this.monto, metodoPago: this.metodoPago }).subscribe({
      next: (resultado) => {
        this.abonando.set(false);
        this.ultimoAbono.set(resultado);
        this.notificacionService.exito('Abono registrado.');
        this.cargar();
        if (this.clienteActual()) {
          this.creditoService.estadoCuenta(cuenta.idCliente).subscribe({
            next: (estado) => this.estadoCuenta.set(estado),
          });
        }
      },
      error: (error: unknown) => {
        this.abonando.set(false);
        this.notificacionService.error(mensajeError(error));
      },
    });
  }
}
