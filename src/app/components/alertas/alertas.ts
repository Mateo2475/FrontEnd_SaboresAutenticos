import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AlertaService } from '../../servicios/alerta.service';
import { AlertaDeuda, EnvioAlerta } from '../../models/reporte.models';
import { NotificacionService } from '../../service/notificacion.service';
import { mensajeError } from '../../service/error.util';


@Component({
  selector: 'app-alertas',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './alertas.html',
  styleUrl: './alertas.css'
})


export class Alertas implements OnInit {
  private readonly alertaService = inject(AlertaService);
  private readonly notificacionService = inject(NotificacionService);

  readonly deudores = signal<AlertaDeuda[]>([]);
  readonly envios = signal<EnvioAlerta[]>([]);
  readonly enviando = signal(false);

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.alertaService.previsualizar().subscribe({
      next: (deudores) => this.deudores.set(deudores),
      error: (error: unknown) => this.notificacionService.error(mensajeError(error)),
    });
  }

  enviar(): void {
    this.enviando.set(true);
    this.alertaService.enviar().subscribe({
      next: (envios) => {
        this.enviando.set(false);
        this.envios.set(envios);
        this.notificacionService.exito(`Se procesaron ${envios.length} envíos.`);
      },
      error: (error: unknown) => {
        this.enviando.set(false);
        this.notificacionService.error(mensajeError(error));
      },
    });
  }
}
