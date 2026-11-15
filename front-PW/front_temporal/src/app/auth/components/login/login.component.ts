import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

// 1. ALGORITMO DE VALIDACIÓN DE CÉDULA ECUATORIANA
// (Debe ir aquí afuera del Componente para que TypeScript la reconozca)
export function cedulaEcuatorianaValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const cedula = control.value;
    if (!cedula) return null; 

    // Debe tener 10 dígitos y ser solo números
    if (cedula.length !== 10 || !/^[0-9]+$/.test(cedula)) return { cedulaInvalida: true };

    const provincia = parseInt(cedula.substring(0, 2), 10);
    // Provincias del 1 al 24, o 30 para ecuatorianos en el exterior
    if (provincia < 1 || (provincia > 24 && provincia !== 30)) return { cedulaInvalida: true };

    const tercerDigito = parseInt(cedula.substring(2, 3), 10);
    // Para personas naturales el tercer dígito es menor a 6
    if (tercerDigito >= 6) return { cedulaInvalida: true }; 

    // Algoritmo Módulo 10
    const coeficientes = [2, 1, 2, 1, 2, 1, 2, 1, 2];
    let suma = 0;
    for (let i = 0; i < 9; i++) {
      let valor = parseInt(cedula.charAt(i), 10) * coeficientes[i];
      if (valor > 9) valor -= 9;
      suma += valor;
    }

    const digitoVerificador = parseInt(cedula.charAt(9), 10);
    const decenaSuperior = Math.ceil(suma / 10) * 10;
    let resultado = decenaSuperior - suma;
    if (resultado === 10) resultado = 0;

    return resultado === digitoVerificador ? null : { cedulaInvalida: true };
  };
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {
  loginForm: FormGroup;
  cuentaBloqueada = false;
  mensajeError = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient, 
    private router: Router    
  ) {
    this.loginForm = this.fb.group({
      cedula: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10), cedulaEcuatorianaValidator()]],
      password_hash: ['', Validators.required]
    });
  }

  funIngresar() {
    if (this.cuentaBloqueada || this.loginForm.invalid) return;
    
    this.mensajeError = ''; // Limpiar errores visuales previos

    const payload = {
      cedula: this.loginForm.value.cedula, // Debe decir cedula aquí
      password_hash: this.loginForm.value.password_hash
    };
    
    this.http.post<any>('http://localhost:3000/auth/login', payload).subscribe({
      next: (response) => {
        // ÉXITO
        localStorage.setItem('token', response.token); 
        this.router.navigate(['/admin']);
      },
      error: (err: HttpErrorResponse) => {
        
        if (err.status === 403) {
          // 1. Bloqueamos la pantalla y mostramos el mensaje
          this.cuentaBloqueada = true;
          this.loginForm.disable(); 
          this.mensajeError = err.error.message || 'Cuenta bloqueada.';
          
          // 2. Extraemos el número de minutos del mensaje usando una expresión regular
          const coincidencia = this.mensajeError.match(/(\d+)\s*minuto/);
          
          if (coincidencia && coincidencia[1]) {
            const minutos = parseInt(coincidencia[1], 10);
            
            // 3. Creamos un temporizador que espere esos minutos (convertidos a milisegundos)
            setTimeout(() => {
              this.cuentaBloqueada = false; // Quitamos el bloqueo visual
              this.loginForm.enable();      // Volvemos a habilitar los inputs
              this.loginForm.reset();       // Limpiamos los campos
              this.mensajeError = 'El tiempo de bloqueo ha terminado. Puedes intentar de nuevo.';
            }, minutos * 60000); // 60000 ms = 1 minuto
          }
          
        } else if (err.status === 401) {
          // 401: Contraseña incorrecta (Intento X de 3)
          this.mensajeError = err.error.message || 'Credenciales incorrectas.';
          
        } else if (err.status === 400) {
          this.mensajeError = 'Contraseña incorrecta.';
          
        } else {
          // 500 o Servidor Apagado
          console.error("ERROR COMPLETO DEL BACKEND:", err);
          this.mensajeError = 'Error de conexión con el servidor. (Revisa la consola F12)';
        }
      }
    });
  }
}