import { Component, inject } from '@angular/core';
import { ProductoService } from '../../services/producto.service';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.scss'] // (o styleUrl según tu versión)
})
export class ProductoComponent {

  private productoService = inject(ProductoService);

  categorias: any = [
    { name: 'Ropa Dama', code: 'RD' },
    { name: 'Ropa Caballero', code: 'RC' },
    { name: 'Herramientas', code: 'He' },
    { name: 'Tecnología', code: 'Tec' },
    { name: 'Hogar', code: 'Hgr' }
  ];

  products: any[] = [];
  cols: any[] = [];

  constructor(){
    this.productoService.funListar2().subscribe(
      (res: any) => {
        this.products = res.data;
      }
    );
  }

  openNew(){

  }

  editProduct(product: any) {

  }

  deleteProduct(product: any) {

  }
}

