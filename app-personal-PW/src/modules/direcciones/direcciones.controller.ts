import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { DireccionesService } from './direcciones.service';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateDireccionDto } from './dto/create-direccion.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateDireccioneDto } from './dto/update-direccione.dto';

@ApiTags('CRUD Direcciones')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('direcciones')
export class DireccionesController {

    constructor(private direccionesService: DireccionesService){}

    @ApiOperation({summary: 'Obtener lista de Direcciones'})
    @ApiResponse({status: 200, description: 'Retorna lista de direcciones'})
    @Get()
    funListar(){
        let direcciones = this.direccionesService.findAll()
        return direcciones;
    }

    @ApiOperation({summary: 'Crear una nueva Dirección'})
    @ApiResponse({status: 200, description: 'Registra nueva dirección'})
    @Post()
    funGuardar(@Body() direccion: CreateDireccionDto){
        let respuesta = this.direccionesService.create(direccion)
        return respuesta
    }

    @ApiOperation({summary: 'Actualizar una dirección'})
    @ApiResponse({status: 200, description: 'Actualiza una dirección'})
    @Put(':id')
    funActualizar(
        @Param('id') id: number,
        @Body() direccion: UpdateDireccioneDto,
    ) {
        return this.direccionesService.update(id, direccion);
    }

    @ApiOperation({summary: 'Eliminar una dirección'})
    @ApiResponse({status: 200, description: 'Elimina una dirección'})
    @Delete(':id')
    funEliminar(
        @Param('id') id: number,
    ) {
        return this.direccionesService.delete(id);
    }
}