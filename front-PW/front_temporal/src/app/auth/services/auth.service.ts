import { HttpClient } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment.development';

export interface RegistroFormulario {
  nombre: string;
  apellido: string;
  telefono: string;
  correo: string;
  cedula: string;
  password: string;
}

export interface RegistroBackendPayload {
  nombre: string;
  apellido: string;
  telefono: string;
  email: string; // Columna 'email' en la BD -> Almacena la Cédula
  email1: string; // Columna 'email1' en la BD -> Almacena el Correo Electrónico
  cedula: string;
  password_hash: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly baseUrl = environment.urlServidor || 'http://127.0.0.1:3000';
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'auth_user';

  constructor() {}

  /**
   * Inicia sesión enviando la cédula y contraseña al backend NestJS y almacena el JWT.
   */
  loginConNest(credenciales: { cedula?: string; email?: string; password_hash: string }): Observable<any> {
    const cedulaLimpia = (credenciales.cedula || credenciales.email || '').trim();
    const payload = {
      cedula: cedulaLimpia,
      email: cedulaLimpia,
      password_hash: credenciales.password_hash,
    };

    return this.http.post<any>(`${this.baseUrl}/auth/login`, payload).pipe(
      tap((res) => {
        if (res?.token) {
          this.guardarSesion(res.token, res.usuario);
        }
      }),
    );
  }

  /**
   * Registra un nuevo usuario realizando la transformación requerida para la base de datos:
   * - Cédula del frontend -> se envía en 'email' (columna 'email' de la BD)
   * - Correo Electrónico del frontend -> se envía en 'email1' (columna 'email1' de la BD)
   */
  registroConNest(datos: RegistroFormulario): Observable<any> {
    const payload: RegistroBackendPayload = {
      nombre: datos.nombre.trim(),
      apellido: datos.apellido.trim(),
      telefono: datos.telefono.trim(),
      email: datos.cedula.trim(), // Mapeo: Cédula -> columna 'email'
      email1: datos.correo.trim().toLowerCase(), // Mapeo: Correo -> columna 'email1'
      cedula: datos.cedula.trim(),
      password_hash: datos.password,
    };

    return this.http.post<any>(`${this.baseUrl}/auth/register`, payload);
  }

  /**
   * Solicita el envío de un correo real con un enlace único y token seguro para recuperar contraseña.
   */
  solicitarRecuperacionPassword(correoElectronico: string): Observable<any> {
    const payload = {
      email1: correoElectronico.trim().toLowerCase(),
    };
    return this.http.post<any>(`${this.baseUrl}/auth/forgot-password`, payload);
  }

  /**
   * Restablece la contraseña utilizando el token seguro recibido por correo electrónico.
   */
  restablecerPassword(token: string, nuevaPassword: string): Observable<any> {
    const payload = {
      token,
      password_hash: nuevaPassword,
    };
    return this.http.post<any>(`${this.baseUrl}/auth/reset-password`, payload);
  }

  guardarSesion(token: string, usuario?: any): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.TOKEN_KEY, token);
      if (usuario) {
        localStorage.setItem(this.USER_KEY, JSON.stringify(usuario));
      }
    }
  }

  obtenerToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.TOKEN_KEY);
    }
    return null;
  }

  estaAutenticado(): boolean {
    const token = this.obtenerToken();
    if (!token) {
      return false;
    }
    try {
      const partes = token.split('.');
      if (partes.length !== 3) {
        return false;
      }
      const payload = JSON.parse(atob(partes[1]));
      if (payload.exp && Date.now() >= payload.exp * 1000) {
        this.cerrarSesion();
        return false;
      }
      return true;
    } catch {
      return false;
    }
  }

  cerrarSesion(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.USER_KEY);
    }
  }
}
