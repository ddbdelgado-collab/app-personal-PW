import { Injectable } from '@nestjs/common';
import { Direcciones } from './entities/direccion.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateDireccioneDto } from './dto/update-direccione.dto';

@Injectable()
export class DireccionesService {
    
    constructor(
        @InjectRepository(Direcciones)
        private readonly direccionesRepository: Repository<Direcciones>
    ){}

    async findAll(): Promise<any[]> {
        return await this.direccionesRepository.find({
            relations: { usuario: true }
        });
    }

    async create(direccionDto: any){
        const direccion = new Direcciones();
        direccion.calle_principal = direccionDto.calle_principal;
        direccion.calle_secundaria = direccionDto.calle_secundaria;
        direccion.ciudad = direccionDto.ciudad;
        direccion.referencia = direccionDto.referencia;
        
        direccion.usuario = { id_usuario: direccionDto.id_usuario } as any;

        return await this.direccionesRepository.save(direccion);
    }

    async update(id_direccion: number, direccionDto: UpdateDireccioneDto) {
        await this.direccionesRepository.update(id_direccion, direccionDto);

        return this.direccionesRepository.findOne({
            where: { id_direccion: id_direccion },
            relations: { usuario: true }
        });
    }

    async delete(id_direccion: number) {
        return await this.direccionesRepository.delete(id_direccion);
    }
}