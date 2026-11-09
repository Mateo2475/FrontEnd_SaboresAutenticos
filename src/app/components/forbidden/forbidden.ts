import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-forbidden',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="page-header">
      <h1>403 · Sin permisos</h1>
      <p class="muted">No tiene permisos para acceder a esta sección.</p>
      <a class="btn btn-primary" routerLink="/dashboard">Volver al inicio</a>
    </div>
  `,
})
export class Forbidden {}
