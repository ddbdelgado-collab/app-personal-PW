import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../services/auth.service';
import { CustomValidators } from '../../validators/custom.validators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly messageService = inject(MessageService);

  cargando = false;

  registerForm = new FormGroup({
    nombre: new FormControl('', [
      Validators.required,
      CustomValidators.soloLetras(),
    ]),
    apellido: new FormControl('', [
      Validators.required,
      CustomValidators.soloLetras(),
    ]),
    cedula: new FormControl('', [
      Validators.required,
      CustomValidators.cedulaEcuatoriana(),
    ]),
    telefono: new FormControl('', [
      Validators.required,
      CustomValidators.soloNumeros(),
      Validators.minLength(7),
      Validators.maxLength(15),
    ]),
    correo: new FormControl('', [
      Validators.required,
      CustomValidators.emailEstricto(),
    ]),
    password: new FormControl('', [
      Validators.required,
      CustomValidators.passwordSegura(),
    ]),
  });

  get f() {
    return this.registerForm.controls;
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

  funRegistrar(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      this.messageService.add({
        severity: 'warn',
        summary: 'Revisa los campos',
        detail: 'Por favor, corrige los errores señalados en el formulario antes de continuar.',
      });
      return;
    }

    this.cargando = true;

    const datosFormulario = {
      nombre: this.f.nombre.value ?? '',
      apellido: this.f.apellido.value ?? '',
      telefono: this.f.telefono.value ?? '',
      correo: this.f.correo.value ?? '', // Se mapeará a 'email1' en AuthService
      cedula: this.f.cedula.value ?? '', // Se mapeará a 'email' en AuthService
      password: this.f.password.value ?? '',
    };

    this.authService.registroConNest(datosFormulario).subscribe({
      next: (res) => {
        this.cargando = false;
        this.messageService.add({
          severity: 'success',
          summary: '¡Cuenta creada!',
          detail: res?.message || 'Tu registro se completó exitosamente. Redirigiendo al login...',
          life: 3500,
        });
        this.registerForm.reset();
        setTimeout(() => {
          this.router.navigate(['/auth/login']);
        }, 1400);
      },
      error: (err) => {
        this.cargando = false;
        const mensajeBackend =
          err?.error?.message ||
          'Ocurrió un error al procesar el registro. Inténtalo nuevamente.';
        const detalle = Array.isArray(mensajeBackend)
          ? mensajeBackend.join(', ')
          : mensajeBackend;

        this.messageService.add({
          severity: 'error',
          summary: 'Error en el registro',
          detail: detalle,
          life: 5000,
        });
      },
    });
  }
}
