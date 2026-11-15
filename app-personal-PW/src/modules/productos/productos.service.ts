import { Injectable } from '@nestjs/common';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Productos } from './entities/producto.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductosService {
  constructor(@InjectRepository(Productos) private productosRepository: Repository<Productos>){}

  create(createProductoDto: CreateProductoDto) {
    return this.productosRepository.save(createProductoDto);
  }

  findAll() {
    return this.productosRepository.find();
  }

  findOne(id: number) {
    return this.productosRepository.findOne({
        where: {
            id_producto: id
        }
    });
  }

  update(id: number, updateProductoDto: UpdateProductoDto) {
    return this.productosRepository.update(id, updateProductoDto);
  }

  remove(id: number) {
    return this.productosRepository.delete(id);
  }
}