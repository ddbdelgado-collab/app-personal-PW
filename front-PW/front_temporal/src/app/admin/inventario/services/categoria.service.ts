import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  private baseUrl = environment.urlServidor;
  private http = inject(HttpClient);

    funListar(){
    return this.http.get(`${this.baseUrl}/categoria`);
  }

  funGuardar(registro: any){
    return this.http.post(`${this.baseUrl}/categoria`, registro);
  }

  funModificar(id: number, registro: any){
    return this.http.put(`${this.baseUrl}/categoria/${id}`, registro);
  }

  funEliminar(id: number){
    return this.http.delete(`${this.baseUrl}/categoria/${id}`);
  }

  constructor() { }
}
