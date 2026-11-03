import { Injectable } from '@nestjs/common';
import { Productos } from './entities/producto.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateProductoDto } from './dto/update-producto.dto';

@Injectable()
export class ProductosService {
    
    constructor(
        @InjectRepository(Productos)
        private readonly productosRepository: Repository<Productos>
    ){}

    async findAll(): Promise<any[]> {
        return await this.productosRepository.find({
            relations: { categoria: true }
        });
    }

    async create(productoDto: any){
        const producto = new Productos();
        producto.nombre = productoDto.nombre;
        producto.descripcion = productoDto.descripcion;
        producto.precio = productoDto.precio;
        producto.stock = productoDto.stock;
        producto.imagen_url = productoDto.imagen_url;
        
        // Mapeo de la llave foránea
        producto.categoria = { id_categoria: productoDto.id_categoria } as any;

        return await this.productosRepository.save(producto);
    }

    async update(id_producto: number, productoDto: UpdateProductoDto) {
        await this.productosRepository.update(id_producto, productoDto);

        return this.productosRepository.findOne({
            where: { id_producto: id_producto },
            relations: { categoria: true }
        });
    }

    async delete(id_producto: number) {
        return await this.productosRepository.delete(id_producto);
    }
}