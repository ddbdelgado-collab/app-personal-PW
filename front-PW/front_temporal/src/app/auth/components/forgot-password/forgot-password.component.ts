import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../services/auth.service';
import { CustomValidators } from '../../validators/custom.validators';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css',
})
export class ForgotPasswordComponent {
  private readonly authService = inject(AuthService);
  private readonly messageService = inject(MessageService);

  cargando = false;
  correoEnviado = false;
  ultimoCorreo = '';

  forgotForm = new FormGroup({
    correo: new FormControl('', [
      Validators.required,
      CustomValidators.emailEstricto(),
    ]),
  });

  get f() {
    return this.forgotForm.controls;
  }

  funSolicitarEnlace(): void {
    if (this.forgotForm.invalid) {
      this.forgotForm.markAllAsTouched();
      this.messageService.add({
        severity: 'warn',
        summary: 'Correo inválido',
        detail: 'Ingresa un correo electrónico válido para recibir el enlace de recuperación.',
      });
      return;
    }

    this.cargando = true;
    const correo = this.f.correo.value ?? '';

    this.authService.solicitarRecuperacionPassword(correo).subscribe({
      next: (res) => {
        this.cargando = false;
        this.correoEnviado = true;
        this.ultimoCorreo = correo;
        this.messageService.add({
          severity: 'success',
          summary: 'Enlace enviado',
          detail:
            res?.message ||
            'Hemos enviado un enlace seguro de recuperación a tu correo electrónico.',
          life: 5000,
        });
      },
      error: (err) => {
        this.cargando = false;
        const mensajeBackend =
          err?.error?.message ||
          'No se pudo procesar la solicitud de recuperación.';
        const detalle = Array.isArray(mensajeBackend)
          ? mensajeBackend.join(', ')
          : mensajeBackend;

        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: detalle,
          life: 5000,
        });
      },
    });
  }
}
