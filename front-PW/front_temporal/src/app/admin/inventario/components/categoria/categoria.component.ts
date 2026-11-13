import { Component, inject, OnInit } from '@angular/core';
import { CategoriaService } from '../../services/categoria.service';
import { FormGroup, FormControl } from '@angular/forms';
import Swal from 'sweetalert2';

  interface Categoria {
    id_categoria: number;
    nombre: string;
    descripcion: string;
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
  categoria_id: number = -1;
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
      this.alerta('Error', 'Error al intentar listar las categorías', 'error');
    }
  );

  }
  mostrarDialog(){
    this.dialog_visible = true;

  }

  guardarCategoria() {
    if (this.categoria_id > 0) {
        this.categoriaService.funModificar(this.categoria_id, this.categoriaForm.value).subscribe(
          (res: any) => {
              this.dialog_visible = false;
              this.getCategorias();
              this.categoria_id = -1;

              this.alerta('Actualizado', 'La categoría se actualizó correctamente', 'success');
          },
          (error: any) => {
            this.alerta('Error', 'Error al intentar modificar la categoría', 'error');
          }
        );
        this.categoriaForm.reset();
    } 
    else {
        this.categoriaService.funGuardar(this.categoriaForm.value).subscribe(
          (res: any) => {
            this.dialog_visible = false;
            this.getCategorias();

            this.alerta('Registrado', 'La categoría se creó correctamente', 'success');
          },
          (error: any) => {
            this.alerta('Error', 'Error al intentar guardar la categoría', 'error');
          }
        );
    }

    this.categoriaForm.reset();
  }

  editarCategoria(categoria: Categoria){
    this.dialog_visible = true;
    this.categoria_id = categoria.id_categoria ?? -1;
    this.categoriaForm.setValue({ nombre: categoria.nombre, descripcion: categoria.descripcion});

  }
  eliminarCategoria(categoria: Categoria){
  Swal.fire({
    title: "¿Está seguro de eliminar la categoría?",
    text: "Una vez eliminado no se podrá recuperar!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Si, eliminar!"
  }).then((result) => {
    if (result.isConfirmed) {
      this.categoriaService.funEliminar(categoria.id_categoria).subscribe(
        (res: any) => {
          this.alerta("ELIMINADO!", "Categoría eliminada.", "success");
          this.getCategorias();
          this.categoria_id=-1
        },
        (error: any) => {
          this.alerta("ERROR!", "Error al intentar eliminar.", "error");
        }
      )
    }
  })
  }
  alerta(title:string, text:string, icon:'success'|'error'|'info'|'question'){
  Swal.fire({ title, text, icon });
    //title: title,
    //text: text,
    //icon: icon
  }
}