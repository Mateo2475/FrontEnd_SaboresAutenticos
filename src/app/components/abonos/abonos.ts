import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AbonoService } from '../../servicios/abono.service';
import { CreditoService } from '../../servicios/credito.service';
import { AuthService } from '../../service/auth.service';
import { Abono, AbonoAplicado } from '../../models/abono.models';
import { CuentaCredito } from '../../models/credito.models';
import { NotificacionService } from '../../service/notificacion.service';
import { mensajeError } from '../../service/error.util';

@Component({
  selector: 'app-abonos',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './abonos.html',
  styleUrl: './abonos.css'
})

export class Abonos implements OnInit {
  private readonly abonoService = inject(AbonoService);
  private readonly creditoService = inject(CreditoService);
  private readonly notificacionService = inject(NotificacionService);
  readonly authService = inject(AuthService);
  readonly puedeEscribir = computed(() => this.authService.tieneRol('ADMIN', 'CAJERO'));

  readonly abonos = signal<Abono[]>([]);
  readonly deudores = signal<CuentaCredito[]>([]);
  readonly registrando = signal(false);
  readonly resultado = signal<AbonoAplicado | null>(null);

  idCliente: number | null = null;
  monto = 0;
  metodoPago = 'EFECTIVO';

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.abonoService.listar().subscribe({
      next: (abonos) => this.abonos.set(abonos),
      error: (error: unknown) => this.notificacionService.error(mensajeError(error)),
    });
    this.creditoService.deudores().subscribe({
      next: (deudores) => this.deudores.set(deudores),
      error: (error: unknown) => this.notificacionService.error(mensajeError(error)),
    });
  }

  registrar(): void {
    if (this.idCliente === null) {
      this.notificacionService.error('Seleccione un cliente.');
      return;
    }
    if (!this.monto || this.monto <= 0) {
      this.notificacionService.error('Ingrese un monto válido.');
      return;
    }

    this.registrando.set(true);
    this.abonoService.registrar({ idCliente: this.idCliente, monto: this.monto, metodoPago: this.metodoPago }).subscribe({
      next: (resultado) => {
        this.registrando.set(false);
        this.resultado.set(resultado);
        this.notificacionService.exito('Abono registrado.');
        this.monto = 0;
        this.idCliente = null;
        this.cargar();
      },
      error: (error: unknown) => {
        this.registrando.set(false);
        this.notificacionService.error(mensajeError(error));
      },
    });
  }
}
