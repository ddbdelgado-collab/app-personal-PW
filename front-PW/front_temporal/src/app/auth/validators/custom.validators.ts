import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {
  /**
   * Valida que el campo contenga únicamente letras (incluyendo tildes y ñ) y espacios.
   * No permite números ni caracteres especiales.
   */
  static soloLetras(): ValidatorFn {
    const regex = /^(?=.*[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ])[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/;
    return (control: AbstractControl): ValidationErrors | null => {
      const valor = control.value;
      if (!valor) {
        return null;
      }
      return regex.test(valor) ? null : { soloLetras: true };
    };
  }

  /**
   * Valida que el campo contenga únicamente caracteres numéricos (0-9).
   */
  static soloNumeros(): ValidatorFn {
    const regex = /^[0-9]+$/;
    return (control: AbstractControl): ValidationErrors | null => {
      const valor = control.value;
      if (!valor) {
        return null;
      }
      return regex.test(String(valor)) ? null : { soloNumeros: true };
    };
  }

  /**
   * Validación estricta de formato de correo electrónico:
   * Debe contener '@' y un dominio con extensión válida (.com, .net, .ec, .edu.ec, etc.).
   */
  static emailEstricto(): ValidatorFn {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,}$/;
    return (control: AbstractControl): ValidationErrors | null => {
      const valor = control.value;
      if (!valor) {
        return null;
      }
      return regex.test(String(valor).trim()) ? null : { emailEstricto: true };
    };
  }

  /**
   * Algoritmo matemático Módulo 10 para validar Cédulas de Identidad de Ecuador.
   * Verifica longitud (10 dígitos), código de provincia (01-24 o 30),
   * tercer dígito (< 6) y dígito verificador Módulo 10.
   */
  static cedulaEcuatoriana(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const valorRaw = control.value;
      if (!valorRaw) {
        return null;
      }

      const cedula = String(valorRaw).trim();

      // 1. Verificar que contenga exactamente 10 dígitos numéricos
      if (!/^\d{10}$/.test(cedula)) {
        return {
          cedulaInvalida: {
            motivo: 'La cédula debe contener exactamente 10 dígitos numéricos.',
          },
        };
      }

      // 2. Verificar código de provincia (01 a 24, o 30 para ecuatorianos en el exterior)
      const provincia = parseInt(cedula.substring(0, 2), 10);
      if (!((provincia >= 1 && provincia <= 24) || provincia === 30)) {
        return {
          cedulaInvalida: {
            motivo: 'El código de provincia (dos primeros dígitos) no es válido.',
          },
        };
      }

      // 3. Verificar tercer dígito (debe ser menor a 6 para cédulas de personas naturales)
      const tercerDigito = parseInt(cedula.charAt(2), 10);
      if (tercerDigito >= 6) {
        return {
          cedulaInvalida: {
            motivo: 'El tercer dígito de la cédula no corresponde a una persona natural.',
          },
        };
      }

      // 4. Algoritmo Módulo 10 sobre los primeros 9 dígitos
      const coeficientes = [2, 1, 2, 1, 2, 1, 2, 1, 2];
      let suma = 0;

      for (let i = 0; i < 9; i++) {
        let producto = parseInt(cedula.charAt(i), 10) * coeficientes[i];
        if (producto >= 10) {
          producto -= 9;
        }
        suma += producto;
      }

      const digitoVerificadorCalculado = (10 - (suma % 10)) % 10;
      const digitoVerificadorReal = parseInt(cedula.charAt(9), 10);

      if (digitoVerificadorCalculado !== digitoVerificadorReal) {
        return {
          cedulaInvalida: {
            motivo: 'La cédula ingresada no supera la validación matemática Módulo 10.',
          },
        };
      }

      return null;
    };
  }

  /**
   * Valida que la contraseña sea segura:
   * - Al menos 1 letra mayúscula
   * - Al menos 1 número
   * - Al menos 1 carácter especial (signo)
   * - Mínimo 6 caracteres
   */
  static passwordSegura(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const valor = control.value;
      if (!valor) {
        return null;
      }

      const texto = String(valor);
      const tieneMayuscula = /[A-Z]/.test(texto);
      const tieneNumero = /[0-9]/.test(texto);
      const tieneCaracterEspecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`¡¿]/.test(texto);
      const tieneLongitudMinima = texto.length >= 6;

      const errores: ValidationErrors = {};

      if (!tieneMayuscula) {
        errores['faltaMayuscula'] = true;
      }
      if (!tieneNumero) {
        errores['faltaNumero'] = true;
      }
      if (!tieneCaracterEspecial) {
        errores['faltaCaracterEspecial'] = true;
      }
      if (!tieneLongitudMinima) {
        errores['longitudMinima'] = true;
      }

      return Object.keys(errores).length > 0 ? errores : null;
    };
  }

  /**
   * Validador a nivel de FormGroup para confirmar que dos campos de contraseña coinciden.
   */
  static coincidenciaPasswords(passwordKey: string, confirmPasswordKey: string): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const passwordControl = group.get(passwordKey);
      const confirmControl = group.get(confirmPasswordKey);

      if (!passwordControl || !confirmControl) {
        return null;
      }

      if (confirmControl.errors && !confirmControl.errors['noCoinciden']) {
        return null;
      }

      if (passwordControl.value !== confirmControl.value) {
        confirmControl.setErrors({ ...(confirmControl.errors || {}), noCoinciden: true });
        return { noCoinciden: true };
      } else {
        if (confirmControl.errors) {
          delete confirmControl.errors['noCoinciden'];
          if (Object.keys(confirmControl.errors).length === 0) {
            confirmControl.setErrors(null);
          }
        }
        return null;
      }
    };
  }
}
