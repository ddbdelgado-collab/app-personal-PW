import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { CategoriasService } from './categorias.service';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';

@ApiTags('CRUD Categorias')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('categorias')
export class CategoriasController {

    constructor(private categoriasService: CategoriasService){}

    @ApiOperation({summary: 'Obtener lista de Categorias'})
    @ApiResponse({status: 200, description: 'Retorna lista de categorias'})
    @Get()
    funListar(){
        let categorias = this.categoriasService.findAll()
        return categorias;
    }

    @ApiOperation({summary: 'Crear una nueva Categoria'})
    @ApiResponse({status: 200, description: 'Registra nueva categoria'})
    @Post()
    funGuardar(@Body() categoria: CreateCategoriaDto){
        let respuesta = this.categoriasService.create(categoria)
        return respuesta
    }

    @ApiOperation({summary: 'Actualizar una categoria'})
    @ApiResponse({status: 200, description: 'Actualiza una categoria'})
    @Put(':id')
    funActualizar(
        @Param('id') id: number,
        @Body() categoria: UpdateCategoriaDto,
    ) {
        return this.categoriasService.update(id, categoria);
    }

    @ApiOperation({summary: 'Eliminar una categoria'})
    @ApiResponse({status: 200, description: 'Elimina una categoria'})
    @Delete(':id')
    funEliminar(
        @Param('id') id: number,
    ) {
        return this.categoriasService.delete(id);
    }
}