import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { NotificacionService } from '../../service/notificacion.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MENU_ITEMS } from '../../shared/roles-menu';
import { RealtimeService } from '../../service/realtime.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './layout.html',
  styleUrl: './layout.css'
})

export class Layout implements OnInit {
  readonly authService = inject(AuthService);
  private readonly notificacionService = inject(NotificacionService);
  private readonly realtimeService = inject(RealtimeService);

  readonly menuAbierto = signal(false);
  readonly notificaciones = this.notificacionService.notificaciones;
  readonly conectado = this.realtimeService.conectado;

  readonly itemsVisibles = computed(() =>
    MENU_ITEMS.filter((item) => item.roles.length === 0 || this.authService.tieneRol(...item.roles)),
  );

  ngOnInit(): void {
    this.realtimeService.conectar();
  }

  cerrar(id: number): void {
    this.notificacionService.cerrar(id);
  }
}
