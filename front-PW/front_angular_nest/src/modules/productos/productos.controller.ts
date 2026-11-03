import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ProductosService } from './productos.service';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateProductoDto } from './dto/create-producto.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateProductoDto } from './dto/update-producto.dto';

@ApiTags('CRUD Productos')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('productos')
export class ProductosController {

    constructor(private productosService: ProductosService){}

    @ApiOperation({summary: 'Obtener lista de Productos'})
    @ApiResponse({status: 200, description: 'Retorna lista de productos'})
    @Get()
    funListar(){
        let productos = this.productosService.findAll()
        return productos;
    }

    @ApiOperation({summary: 'Crear un nuevo Producto'})
    @ApiResponse({status: 200, description: 'Registra nuevo producto'})
    @Post()
    funGuardar(@Body() producto: CreateProductoDto){
        let respuesta = this.productosService.create(producto)
        return respuesta
    }

    @ApiOperation({summary: 'Actualizar un producto'})
    @ApiResponse({status: 200, description: 'Actualiza un producto'})
    @Put(':id')
    funActualizar(
        @Param('id') id: number,
        @Body() producto: UpdateProductoDto,
    ) {
        return this.productosService.update(id, producto);
    }

    @ApiOperation({summary: 'Eliminar un producto'})
    @ApiResponse({status: 200, description: 'Elimina un producto'})
    @Delete(':id')
    funEliminar(
        @Param('id') id: number,
    ) {
        return this.productosService.delete(id);
    }
}