import { Component } from '@angular/core';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrl: './producto.component.scss'
})
export class ProductoComponent {
  products: any[] = [
    { id: 1, nombre: "Teclado", precio: 394.96, categoria_id: 5, stock: 12, estado: "Instock" },
    { id: 1, nombre: "Teclado", precio: 394.96, categoria_id: 5, stock: 12, estado: "Instock" },
    { id: 1, nombre: "Teclado", precio: 394.96, categoria_id: 5, stock: 12, estado: "Instock" },
    { id: 1, nombre: "Teclado", precio: 394.96, categoria_id: 5, stock: 12, estado: "Instock" },
    { id: 1, nombre: "Teclado", precio: 394.96, categoria_id: 5, stock: 12, estado: "Instock" },
    { id: 1, nombre: "Teclado", precio: 394.96, categoria_id: 5, stock: 12, estado: "Instock" },
    { id: 1, nombre: "Teclado", precio: 394.96, categoria_id: 5, stock: 12, estado: "Instock" },
    { id: 1, nombre: "Teclado", precio: 394.96, categoria_id: 5, stock: 12, estado: "Instock" },
    { id: 1, nombre: "Teclado", precio: 394.96, categoria_id: 5, stock: 12, estado: "Instock" },
    { id: 1, nombre: "Teclado", precio: 394.96, categoria_id: 5, stock: 12, estado: "Instock" },
    { id: 1, nombre: "Teclado", precio: 394.96, categoria_id: 5, stock: 12, estado: "Instock" },
    { id: 1, nombre: "Teclado", precio: 394.96, categoria_id: 5, stock: 12, estado: "Instock" },
    { id: 1, nombre: "Teclado", precio: 394.96, categoria_id: 5, stock: 12, estado: "Instock" },
    { id: 1, nombre: "Teclado", precio: 394.96, categoria_id: 5, stock: 12, estado: "Instock" },
    { id: 1, nombre: "Teclado", precio: 394.96, categoria_id: 5, stock: 12, estado: "Instock" },
    { id: 1, nombre: "Teclado", precio: 394.96, categoria_id: 5, stock: 12, estado: "Instock" },
    { id: 1, nombre: "Teclado", precio: 394.96, categoria_id: 5, stock: 12, estado: "Instock" },
    { id: 1, nombre: "Teclado", precio: 394.96, categoria_id: 5, stock: 12, estado: "Instock" },
    // Copia y pega la línea anterior 14 veces más para simular la carga y probar el paginador
  ];
  cols: any[] = [];

  openNew() {
  }

  editProduct(prod: any) {
  }

  deleteProduct(prod: any) {
  }
}
