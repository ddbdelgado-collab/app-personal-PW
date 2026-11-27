import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../services/auth.service';
import { CustomValidators } from '../../validators/custom.validators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly messageService = inject(MessageService);

  cargando = false;
  recordarme = false;

  loginForm = new FormGroup({
    cedula: new FormControl('', [
      Validators.required,
      CustomValidators.cedulaEcuatoriana(),
    ]),
    password_hash: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
  });

  get f() {
    return this.loginForm.controls;
  }

  funIngresar(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.messageService.add({
        severity: 'warn',
        summary: 'Formulario incompleto',
        detail: 'Por favor, ingresa una cédula ecuatoriana válida y tu contraseña.',
      });
      return;
    }

    this.cargando = true;
    const credenciales = {
      cedula: this.loginForm.value.cedula ?? '',
      password_hash: this.loginForm.value.password_hash ?? '',
    };

    this.authService.loginConNest(credenciales).subscribe({
      next: () => {
        this.cargando = false;
        this.messageService.add({
          severity: 'success',
          summary: '¡Bienvenido!',
          detail: 'Inicio de sesión exitoso.',
        });
        setTimeout(() => {
          this.router.navigate(['/admin']);
        }, 600);
      },
      error: (err) => {
        this.cargando = false;
        const mensajeBackend =
          err?.error?.message ||
          'No se pudo iniciar sesión. Verifica tus credenciales.';
        const detalle = Array.isArray(mensajeBackend)
          ? mensajeBackend.join(', ')
          : mensajeBackend;

        this.messageService.add({
          severity: 'error',
          summary: 'Error de autenticación',
          detail: detalle,
          life: 5000,
        });
      },
    });
  }
}
