import { Component, OnInit, inject, signal } from '@angular/core';
import { UsuarioService } from '../../servicios/usuario.service';
import { Usuario } from '../../models/usuario.models';
import { NotificacionService } from '../../service/notificacion.service';
import { mensajeError } from '../../service/error.util';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [ /* no borres tus imports */ ],
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.css'
})

export class Usuarios implements OnInit {
  private readonly usuarioService = inject(UsuarioService);
  private readonly notificacionService = inject(NotificacionService);

  readonly usuarios = signal<Usuario[]>([]);

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.usuarioService.listar().subscribe({
      next: (usuarios) => this.usuarios.set(usuarios),
      error: (error: unknown) => this.notificacionService.error(mensajeError(error)),
    });
  }

  cambiarEstado(usuario: Usuario): void {
    this.usuarioService.cambiarEstado(usuario.username, !usuario.enabled).subscribe({
      next: () => {
        this.notificacionService.exito(usuario.enabled ? 'Usuario deshabilitado.' : 'Usuario habilitado.');
        this.cargar();
      },
      error: (error: unknown) => this.notificacionService.error(mensajeError(error)),
    });
  }

  desbloquear(usuario: Usuario): void {
    this.usuarioService.desbloquear(usuario.username).subscribe({
      next: () => {
        this.notificacionService.exito('Usuario desbloqueado.');
        this.cargar();
      },
      error: (error: unknown) => this.notificacionService.error(mensajeError(error)),
    });
  }
}
