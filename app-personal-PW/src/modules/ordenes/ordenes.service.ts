import { Injectable, BadRequestException } from '@nestjs/common';
import { Ordenes } from './entities/orden.entity';
import { DetallesOrden } from '../detalles_ordenes/entities/detalles_orden.entity';
import { ItemsCarrito } from '../items_carrito/entities/items_carrito.entity';  
import { Productos } from '../productos/entities/producto.entity';      
import { Repository, DataSource } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateOrdenDto } from './dto/update-ordene.dto';

@Injectable()
export class OrdenesService {
    
    constructor(
        @InjectRepository(Ordenes)
        private readonly ordenesRepository: Repository<Ordenes>,
        private readonly dataSource: DataSource 
    ){}

    async findAll(): Promise<any[]> {
        return await this.ordenesRepository.find({
            relations: { usuario: true } 
        });
    }

    async create(ordenDto: any) {
        return await this.dataSource.transaction(async (transactionalEntityManager) => {
            
            // SOLUCIÓN: Extraemos los repositorios tipados de la transacción
            // Así TypeScript reconoce perfectamente qué métodos y propiedades tiene cada tabla
            const itemsRepo = transactionalEntityManager.getRepository(ItemsCarrito);
            const ordenesRepo = transactionalEntityManager.getRepository(Ordenes);
            const detallesRepo = transactionalEntityManager.getRepository(DetallesOrden);
            const productosRepo = transactionalEntityManager.getRepository(Productos);

            // 1. Buscar todos los items en el carrito del usuario
            const itemsCarrito = await itemsRepo.find({
                where: { usuario: { id_usuario: ordenDto.id_usuario } },
                relations: { producto: true } 
            });

            if (!itemsCarrito || itemsCarrito.length === 0) {
                throw new BadRequestException('El carrito está vacío, no se puede crear la orden.');
            }

            let totalCalculado = 0;

            // 2. Validar stock y calcular el total real
            for (const item of itemsCarrito) {
                if (item.producto.stock < item.cantidad) {
                    throw new BadRequestException(`No hay stock suficiente para el producto: ${item.producto.nombre}`);
                }
                totalCalculado += Number(item.producto.precio) * item.cantidad;
            }

            // 3. Crear y guardar la Orden principal
            const nuevaOrden = new Ordenes();
            nuevaOrden.total = totalCalculado;
            nuevaOrden.estado = 'pendiente';
            nuevaOrden.direccion_envio_texto = ordenDto.direccion_envio_texto;
            nuevaOrden.usuario = { id_usuario: ordenDto.id_usuario } as any;

            const ordenGuardada = await ordenesRepo.save(nuevaOrden);

            // 4. Crear los Detalles de la Orden y descontar el stock
            for (const item of itemsCarrito) {
                const detalle = new DetallesOrden();
                detalle.cantidad = item.cantidad;
                detalle.precio_unitario = item.producto.precio;
                detalle.orden = ordenGuardada;
                detalle.producto = item.producto;

                await detallesRepo.save(detalle);

                // Descontar el stock del producto
                item.producto.stock -= item.cantidad;
                await productosRepo.save(item.producto);
            }

            // 5. Vaciar el carrito de este usuario
            await itemsRepo.delete({
                usuario: { id_usuario: ordenDto.id_usuario }
            });

            return ordenGuardada;
        });
    }

    async update(id_orden: number, ordenDto: UpdateOrdenDto) {
        await this.ordenesRepository.update(id_orden, {
            estado: ordenDto.estado 
        });

        return this.ordenesRepository.findOne({
            where: { id_orden: id_orden },
            relations: { usuario: true} 
        });
    }

    async delete(id_orden: number) {
        return await this.ordenesRepository.delete(id_orden);
    }
}