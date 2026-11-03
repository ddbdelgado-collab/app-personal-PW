import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@ApiTags('CRUD Usuarios')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('usuarios')
export class UsuariosController {

    constructor(private UsuariosService: UsuariosService){}

    @ApiOperation({summary: 'Obtener lista de Usuarios'})
    @ApiResponse({status: 200, description: 'Retorna lista de usuarios'})
    @Get()
    funListar(){
        let usuarios = this.UsuariosService.findAll()
        return usuarios;
    }

    @ApiOperation({summary: 'Crear un nuevo Usuario'})
    @ApiResponse({status: 200, description: 'Registra nuevo usuario'})
    @Post()
    funGuardar(@Body() usua: CreateUsuarioDto){
        let respuesta = this.UsuariosService.create(usua)
        return respuesta
    }

    @ApiOperation({summary: 'Actualizar un usuario'})
    @ApiResponse({status: 200, description: 'Actualiza un usuario'})
    @Put(':id')
    funActualizar(
        @Param('id') id: number,
        @Body() usua: UpdateUsuarioDto,
    ) {
        return this.UsuariosService.update(id, usua);
    }

    @ApiOperation({summary: 'Eliminar un usuario'})
    @ApiResponse({status: 200, description: 'Elimina un usuario'})
    @Delete(':id')
    funEliminar(
        @Param('id') id: number,
    ) {
        return this.UsuariosService.delete(id);
    }
}
