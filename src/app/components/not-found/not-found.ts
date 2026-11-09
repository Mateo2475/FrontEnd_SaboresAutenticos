import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="page-header">
      <h1>404 · Página no encontrada</h1>
      <p class="muted">La ruta solicitada no existe.</p>
      <a class="btn btn-primary" routerLink="/dashboard">Volver al inicio</a>
    </div>
  `,
})
export class NotFound {}
