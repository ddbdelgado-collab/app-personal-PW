import { Injectable } from '@nestjs/common';
import { Usuarios } from './entities/usuario.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuariosService {
    private usuarios: any[] = [];
    constructor(@InjectRepository(Usuarios)private readonly usuariosRepository: Repository<Usuarios>){}
    async findAll(): Promise<any[]> {
        return await this.usuariosRepository.find();
    }

    async create(usua: any){
        const usuarios = new Usuarios();
        usuarios.cedula = usua.email || usua.cedula;
        usuarios.email1 = usua.email1;
        const plainPassword = usua.password_hash || usua.password;
        usuarios.password_hash = plainPassword?.startsWith('$2b$')
            ? plainPassword
            : await bcrypt.hash(plainPassword, 10);
        usuarios.nombre = usua.nombre;
        usuarios.apellido = usua.apellido;
        usuarios.telefono = usua.telefono;
        return await this.usuariosRepository.save(usuarios);
    }

    async update(id_usuario: number, usua: UpdateUsuarioDto) {
        await this.usuariosRepository.update(id_usuario, usua);

        return this.usuariosRepository.findOne({
        where: { id_usuario: id_usuario }
    });
    }

    async delete(id_usuario: number) {
        return await this.usuariosRepository.delete(id_usuario);
    }
}
