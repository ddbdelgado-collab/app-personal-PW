import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../services/auth.service';
import { CustomValidators } from '../../validators/custom.validators';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css',
})
export class ResetPasswordComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly messageService = inject(MessageService);

  token = '';
  cargando = false;
  passwordActualizada = false;

  resetForm = new FormGroup(
    {
      password: new FormControl('', [
        Validators.required,
        CustomValidators.passwordSegura(),
      ]),
      confirmPassword: new FormControl('', [Validators.required]),
    },
    {
      validators: CustomValidators.coincidenciaPasswords('password', 'confirmPassword'),
    },
  );

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((queryParams) => {
      const tokenQuery = queryParams.get('token');
      if (tokenQuery) {
        this.token = tokenQuery;
      }
    });

    this.route.paramMap.subscribe((params) => {
      const tokenParam = params.get('token');
      if (tokenParam && !this.token) {
        this.token = tokenParam;
      }
    });
  }

  get f() {
    return this.resetForm.controls;
  }

  get tieneMayuscula(): boolean {
    return /[A-Z]/.test(this.f.password.value || '');
  }

  get tieneNumero(): boolean {
    return /[0-9]/.test(this.f.password.value || '');
  }

  get tieneEspecial(): boolean {
    return /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`¡¿]/.test(this.f.password.value || '');
  }

  get tieneLongitudMinima(): boolean {
    return (this.f.password.value || '').length >= 6;
  }

  funRestablecerPassword(): void {
    if (!this.token) {
      this.messageService.add({
        severity: 'error',
        summary: 'Enlace inválido',
        detail: 'No se encontró un token de recuperación válido en la URL. Solicita un nuevo enlace.',
      });
      return;
    }

    if (this.resetForm.invalid) {
      this.resetForm.markAllAsTouched();
      this.messageService.add({
        severity: 'warn',
        summary: 'Verifica tu contraseña',
        detail: 'La contraseña debe cumplir todos los requisitos de seguridad y coincidir en ambos campos.',
      });
      return;
    }

    this.cargando = true;
    const nuevaPassword = this.f.password.value ?? '';

    this.authService.restablecerPassword(this.token, nuevaPassword).subscribe({
      next: (res) => {
        this.cargando = false;
        this.passwordActualizada = true;
        this.messageService.add({
          severity: 'success',
          summary: '¡Contraseña actualizada!',
          detail:
            res?.message ||
            'Tu contraseña se ha restablecido correctamente. Redirigiendo al login...',
          life: 4000,
        });
        setTimeout(() => {
          this.router.navigate(['/auth/login']);
        }, 1800);
      },
      error: (err) => {
        this.cargando = false;
        const mensajeBackend =
          err?.error?.message ||
          'El enlace ha expirado o no es válido. Por favor, solicita uno nuevo.';
        const detalle = Array.isArray(mensajeBackend)
          ? mensajeBackend.join(', ')
          : mensajeBackend;

        this.messageService.add({
          severity: 'error',
          summary: 'No se pudo actualizar',
          detail: detalle,
          life: 5000,
        });
      },
    });
  }
}
