import { Injectable } from '@nestjs/common';
import { Categorias } from './entities/categoria.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';
import { CreateCategoriaDto } from './dto/create-categoria.dto';

@Injectable()
export class CategoriasService {
    
    constructor(
        @InjectRepository(Categorias)
        private readonly categoriasRepository: Repository<Categorias>
    ){}

    async findAll(): Promise<any[]> {
        return await this.categoriasRepository.find();
    }

    async create(categoriaDto: CreateCategoriaDto){
        const categoria = new Categorias();
        categoria.nombre = categoriaDto.nombre;
        categoria.descripcion = categoriaDto.descripcion;
        
        return await this.categoriasRepository.save(categoria);
    }

    async update(id_categoria: number, categoriaDto: UpdateCategoriaDto) {
        await this.categoriasRepository.update(id_categoria, categoriaDto);

        return this.categoriasRepository.findOne({
            where: { id_categoria: id_categoria }
        });
    }

    async delete(id_categoria: number) {
        return await this.categoriasRepository.delete(id_categoria);
    }
}