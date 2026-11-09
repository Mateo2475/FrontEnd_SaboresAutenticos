import { Component, inject, signal } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { mensajeError } from '../../service/error.util';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})

export class Login {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly cargando = signal(false);
  readonly error = signal('');
  readonly capsLock = signal(false);

  verificarCaps(event: KeyboardEvent): void {
    this.capsLock.set(event.getModifierState?.('CapsLock') ?? false);
  }

  readonly form = this.fb.nonNullable.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  ingresar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.cargando.set(true);
    this.error.set('');
    this.authService.login(this.form.getRawValue()).subscribe({
      next: () => {
        this.cargando.set(false);
        void this.router.navigate([this.authService.esAlmacenero() ? '/inventario' : '/dashboard']);
      },
      error: (error: unknown) => {
        this.cargando.set(false);
        this.error.set(mensajeError(error));
      },
    });
  }
}
