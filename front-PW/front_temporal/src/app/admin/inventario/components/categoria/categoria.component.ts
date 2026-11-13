import { Component, inject, OnInit } from '@angular/core';
import { CategoriaService } from '../../services/categoria.service';
import { FormGroup, FormControl } from '@angular/forms';

  interface Categoria {
    id_categoria?: number;
    nombre: string;
    descripcion?: string;
  }

@Component({
  selector: 'app-categoria',
  templateUrl: './categoria.component.html',
  styleUrl: './categoria.component.css'
})
export class CategoriaComponent implements OnInit {
  
  private categoriaService = inject(CategoriaService);

  categorias: Categoria[] = [];
  dialog_visible: boolean = false;
  categoriaForm = new FormGroup({
    nombre: new FormControl(''),
    descripcion: new FormControl('')
  });

  ngOnInit(): void {
    this.getCategorias();
  }

  getCategorias(){
    this.categoriaService.funListar().subscribe(
    (res: any) => {
      console.log('Respuesta del backend:', res);
      this.categorias = res;
    },
    (error: any) => {
      console.error(error);
    }
  );

  }
  mostrarDialog(){
    this.dialog_visible = true;

  }

  guardarCategoria(){
    this.categoriaService.funGuardar(this.categoriaForm.value).subscribe(
        (res:any)=>{
            this.dialog_visible=false;
            this.getCategorias();
        },
        (error:any)=>{
            console.log(error);
        }
    )
  }
}
