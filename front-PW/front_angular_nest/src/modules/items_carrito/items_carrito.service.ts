import { Injectable } from '@nestjs/common';
import { ItemsCarrito } from './entities/items_carrito.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateItemsCarritoDto } from './dto/update-items_carrito.dto';

@Injectable()
export class ItemsCarritoService {
    
    constructor(
        @InjectRepository(ItemsCarrito)
        private readonly itemsCarritoRepository: Repository<ItemsCarrito>
    ){}

    async findAll(): Promise<any[]> {
        return await this.itemsCarritoRepository.find({
            relations: { usuario: true, producto: true }
        });
    }

    async create(itemDto: any){
        const item = new ItemsCarrito();
        item.cantidad = itemDto.cantidad;
        
        // Mapeo de llaves foráneas
        item.usuario = { id_usuario: itemDto.id_usuario } as any;
        item.producto = { id_producto: itemDto.id_producto } as any;

        return await this.itemsCarritoRepository.save(item);
    }

    async update(id_item_carrito: number, itemDto: UpdateItemsCarritoDto) {
        await this.itemsCarritoRepository.update(id_item_carrito, itemDto);

        return this.itemsCarritoRepository.findOne({
            where: { id_item_carrito: id_item_carrito },
            relations: { usuario: true, producto: true }
        });
    }

    async delete(id_item_carrito: number) {
        return await this.itemsCarritoRepository.delete(id_item_carrito);
    }
}
